<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceProduct;
use App\Models\Product;
use App\Models\PurchaseVoucher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $stockByProduct = $this->stockByProduct();
        $products = Product::query()
            ->where('status', 1)
            ->orderBy('name')
            ->get(['id', 'name', 'unit', 'quantity', 'sku', 'sale_unit_price'])
            ->map(fn (Product $product): array => [
                'id' => $product->id,
                'name' => $product->name,
                'unit' => $product->unit,
                'quantity' => (float) ($stockByProduct[$product->id] ?? 0),
                'sku' => $product->sku,
                'sale_unit_price' => (float) ($product->sale_unit_price ?? 0),
            ]);

        $customers = User::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        $invoiceQuery = Invoice::query()
            ->with('customer:id,name')
            ->latest('id')
            ->when($request->filled('search'), function ($query) use ($request): void {
                $search = $request->string('search')->toString();
                $query->where(function ($invoiceQuery) use ($search): void {
                    $invoiceQuery
                        ->where('id', $search)
                        ->orWhereHas('customer', fn ($customerQuery) => $customerQuery->where('name', 'like', "%{$search}%"));
                });
            })
            ->paginate(10)
            ->withQueryString();

        $recentInvoices = $invoiceQuery->through(fn (Invoice $invoice): array => [
            'id' => $invoice->id,
            'customer_name' => $invoice->customer?->name ?? 'Walk-in customer',
            'grand_total' => (float) $invoice->grand_total,
            'paid_amount' => (float) $invoice->paid_amount,
            'due_amount' => (float) $invoice->due_amount,
            'status' => $invoice->status,
            'created_at' => $invoice->created_at?->format('M d, Y H:i'),
        ]);

        return Inertia::render('sales/index', [
            'products' => $products,
            'customers' => $customers,
            'invoices' => $recentInvoices,
            'invoiceSearch' => $request->string('search')->toString(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function dashboard(): \Illuminate\Http\Response|\Inertia\Response
    {
        $today = now()->startOfDay();

        $stockByProduct = $this->stockByProduct();

        $summary = [
            'todayPurchases' => (float) PurchaseVoucher::query()
                ->whereDate('created_at', $today)
                ->sum('total_payment'),
            'todaySales' => (float) Invoice::query()
                ->whereDate('created_at', $today)
                ->sum('grand_total'),
            'voucherPurchases' => (int) PurchaseVoucher::query()
                ->whereDate('created_at', $today)
                ->count(),
        ];

        $stockChart = Product::query()
            ->where('status', 1)
            ->orderBy('name')
            ->get(['id', 'name', 'quantity'])
            ->map(fn (Product $product): array => [
                'name' => $product->name,
                'quantity' => max(0, (float) ($stockByProduct[$product->id] ?? (float) $product->quantity)),
            ])
            ->values()
            ->all();

        return Inertia::render('dashboard', [
            'summary' => $summary,
            'stockChart' => $stockChart,
        ]);
    }

    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->filled('products_payload')) {
            $request->merge([
                'products' => json_decode($request->string('products_payload')->toString(), true),
            ]);
        }

        $validated = $request->validate([
            'mode' => ['required', 'in:pos,manual'],
            'customer_id' => ['nullable', 'integer', 'exists:users,id'],
            'paid_amount' => ['required', 'numeric', 'min:0'],
            'products' => ['required', 'array', 'min:1'],
            'products.*.product_id' => ['required', 'integer', 'distinct', 'exists:products,id'],
            'products.*.quantity' => ['required', 'integer', 'min:1'],
            'products.*.price' => ['required', 'numeric', 'min:0'],
        ]);

        $invoice = DB::transaction(function () use ($validated): Invoice {
            $lineItems = collect($validated['products']);
            $total = 0;

            $products = Product::query()
                ->whereIn('id', $lineItems->pluck('product_id'))
                ->lockForUpdate()
                ->get()
                ->keyBy('id');
            $stockByProduct = $this->stockByProduct();

            $invoiceProducts = $lineItems->map(function (array $lineItem) use ($products, $stockByProduct, $validated, &$total): array {
                $product = $products->get($lineItem['product_id']);
                abort_unless($product, 422, 'A selected product is no longer available.');

                $quantity = (int) $lineItem['quantity'];
                abort_if((float) ($stockByProduct[$product->id] ?? 0) < $quantity, 422, "Insufficient stock for {$product->name}.");

                $price = $validated['mode'] === 'pos'
                    ? (float) ($product->sale_unit_price ?? 0)
                    : (float) $lineItem['price'];
                $lineTotal = round($quantity * $price, 2);
                $total += $lineTotal;

                return [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $price,
                ];
            });

            $paidAmount = round((float) $validated['paid_amount'], 2);
            abort_if($paidAmount > round($total, 2), 422, 'Paid amount cannot exceed the invoice total.');
            $dueAmount = max(0, round($total - $paidAmount, 2));

            $invoice = Invoice::create([
                'customer_id' => $validated['customer_id'] ?? null,
                'grand_total' => round($total, 2),
                'paid_amount' => round($paidAmount, 2),
                'due_amount' => $dueAmount,
                'status' => $dueAmount > 0 ? ($paidAmount > 0 ? 'partial' : 'due') : 'paid',
                'created_by' => Auth::id(),
            ]);

            $invoice->products()->createMany($invoiceProducts->all());

            return $invoice;
        });

        return redirect()->route('sales.index')
            ->with('success', "Invoice #{$invoice->id} created successfully.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        $invoice->load([
            'customer:id,name',
            'products.product:id,name,unit,sku',
        ]);

        return Inertia::render('sales/view', [
            'invoice' => [
                'id' => $invoice->id,
                'customer_name' => $invoice->customer?->name ?? 'Walk-in customer',
                'grand_total' => (float) $invoice->grand_total,
                'paid_amount' => (float) $invoice->paid_amount,
                'due_amount' => (float) $invoice->due_amount,
                'status' => $invoice->status,
                'created_at' => $invoice->created_at?->format('M d, Y H:i'),
                'products' => $invoice->products->map(fn ($invoiceProduct): array => [
                    'id' => $invoiceProduct->id,
                    'name' => $invoiceProduct->product?->name ?? 'Unknown product',
                    'unit' => $invoiceProduct->product?->unit ?? '—',
                    'sku' => $invoiceProduct->product?->sku,
                    'quantity' => (float) $invoiceProduct->quantity,
                    'price' => (float) $invoiceProduct->price,
                    'total' => round((float) $invoiceProduct->quantity * (float) $invoiceProduct->price, 2),
                ])->values(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        //
    }

    /**
     * Calculate current stock from purchased voucher allocations and outgoing quantities.
     *
     * @return array<int, float>
     */
    private function stockByProduct(): array
    {
        $purchased = DB::table('purchase_vouchers')
            ->join('voucher_products', 'voucher_products.voucher_id', '=', 'purchase_vouchers.voucher_id')
            ->where('voucher_products.status', true)
            ->select('voucher_products.product_id', DB::raw('SUM(voucher_products.quantity) as quantity'))
            ->groupBy('voucher_products.product_id')
            ->pluck('quantity', 'product_id');

        $delivered = DB::table('delevered_products')
            ->where('status', true)
            ->select('product_id', DB::raw('SUM(quantity) as quantity'))
            ->groupBy('product_id')
            ->pluck('quantity', 'product_id');

        $sold = InvoiceProduct::query()
            ->select('product_id', DB::raw('SUM(quantity) as quantity'))
            ->groupBy('product_id')
            ->pluck('quantity', 'product_id');

        return $purchased->keys()
            ->merge($delivered->keys())
            ->merge($sold->keys())
            ->unique()
            ->mapWithKeys(fn (int|string $productId): array => [
                (int) $productId => max(
                    0,
                    (float) ($purchased->get($productId) ?? 0)
                    - (float) ($delivered->get($productId) ?? 0)
                    - (float) ($sold->get($productId) ?? 0),
                ),
            ])
            ->all();
    }
}
