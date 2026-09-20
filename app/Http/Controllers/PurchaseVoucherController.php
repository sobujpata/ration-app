<?php

namespace App\Http\Controllers;

use App\Models\DeleveredProduct;
use App\Models\DueProduct;
use App\Models\PurchaseVoucher;
use App\Models\Voucher;
use App\Models\VoucherProduct;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PurchaseVoucherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('purchase-voucher/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $vouchers = Voucher::query()
            ->with([
                'personnelType:id,name',
                'category:id,name',
                'voucherProducts.product:id,name,unit,purchase_unit_price',
            ])
            ->get()
            ->map(fn (Voucher $voucher): array => [
                'id' => $voucher->id,
                'personnel_type' => $voucher->personnelType?->name ?? '—',
                'category' => $voucher->category?->name ?? '—',
                'product_qty' => $voucher->voucherProducts->where('status', true)->count(),
                'total_price' => round($voucher->voucherProducts->where('status', true)->sum(
                    fn (VoucherProduct $voucherProduct): float => (float) $voucherProduct->product?->purchase_unit_price * (float) $voucherProduct->quantity,
                ), 2),
            ]);

        return Inertia::render('purchase-voucher/create', ['vouchers' => $vouchers]);
    }

    /**
     * Find the latest purchase voucher for a service number.
     */
    public function lookup(Request $request)
    {
        $validated = $request->validate([
            'service_no' => ['required', 'string', 'max:10'],
            'for_month' => ['required', 'date_format:Y-m'],
        ]);

        $purchaseVoucher = PurchaseVoucher::query()
            ->with([
                'voucher.personnelType:id,name',
                'voucher.category:id,name',
            ])
            ->where('service_no', $validated['service_no'])
            ->latest('id')
            ->first();

        if (! $purchaseVoucher) {
            return response()->json(['found' => false]);
        }

        return response()->json([
            'found' => true,
            'same_month' => Carbon::parse($purchaseVoucher->for_month)->format('Y-m') === $validated['for_month'],
            'service_no' => $purchaseVoucher->service_no,
            'name' => $purchaseVoucher->name,
            'phone' => $purchaseVoucher->phone,
            'voucher_id' => $purchaseVoucher->voucher_id,
            'raising_cost' => (float) $purchaseVoucher->raising_cost,
            'personnel_type' => $purchaseVoucher->voucher?->personnelType?->name ?? '—',
            'category' => $purchaseVoucher->voucher?->category?->name ?? '—',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_no' => ['required', 'string', 'max:10'],
            'name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'voucher_id' => ['required', 'integer', 'exists:vouchers,id'],
            'for_month' => ['required', 'date_format:Y-m'],
            'raising_cost' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'in:processed,pending,recieved,payment,out-for-delivery,delivered,complete'],
        ]);

        $request->validate([
            'service_no' => [
                Rule::unique('purchase_vouchers', 'service_no')
                    ->where(fn ($query) => $query->where('for_month', $validated['for_month'].'-01')),
            ],
        ]);

        $voucher = Voucher::query()
            ->with('voucherProducts.product:id,purchase_unit_price')
            ->findOrFail($validated['voucher_id']);
        $totalPrice = round($voucher->voucherProducts->where('status', true)->sum(
            fn (VoucherProduct $voucherProduct): float => (float) $voucherProduct->product?->purchase_unit_price * (float) $voucherProduct->quantity,
        ), 2);

        PurchaseVoucher::create([
            ...$validated,
            'for_month' => $validated['for_month'].'-01',
            'total_price' => $totalPrice,
            'raising_cost' => $validated['raising_cost'],
            'total_payment' => max(0, $totalPrice - (float) $validated['raising_cost']),
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('purchase-vouchers.index')
            ->with('success', 'Purchase voucher created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseVoucher $purchaseVoucher)
    {
        $data = PurchaseVoucher::query()
            ->with([
                'voucher.category:id,name',
                'voucher.voucherProducts.product:id,purchase_unit_price',
                'dueProducts.product:id,purchase_unit_price',
                'user:id,name',
            ])
            ->orderBy('id', 'desc')
            ->get()
            ->map(function (PurchaseVoucher $purchaseVoucher): array {
                $dueProductsPrice = $purchaseVoucher->if_due_products
                    ? $purchaseVoucher->dueProducts->sum(
                        fn (DueProduct $dueProduct): float => (float) $dueProduct->quantity * (float) ($dueProduct->product?->purchase_unit_price ?? 0),
                    )
                    : 0;

                return [
                    'id' => $purchaseVoucher->id,
                    'service_no' => $purchaseVoucher->service_no,
                    'name' => $purchaseVoucher->name,
                    'phone' => $purchaseVoucher->phone,
                    'voucher_category' => $purchaseVoucher->voucher?->category?->name ?? '—',
                    'if_due_products' => (bool) $purchaseVoucher->if_due_products,
                    'due_products_price' => round($dueProductsPrice, 2),
                    'total_price' => max(0, round((float) $purchaseVoucher->total_price - $dueProductsPrice, 2)),
                    'raising_cost' => (float) $purchaseVoucher->raising_cost,
                    'total_payment' => max(0, round((float) $purchaseVoucher->total_payment - $dueProductsPrice, 2)),
                    'for_month' => Carbon::parse($purchaseVoucher->for_month)->format('M y'),
                    'status' => $purchaseVoucher->status,
                    'created_by' => $purchaseVoucher->user?->name ?? '—',
                ];
            });

        return response()->json($data);
    }

    /**
     * Display a purchase voucher invoice.
     */
    public function view(PurchaseVoucher $purchaseVoucher)
    {
        $purchaseVoucher->load([
            'voucher.personnelType:id,name',
            'voucher.category:id,name',
            'voucher.voucherProducts.product:id,name,unit,purchase_unit_price',
            'user:id,name',
            'dueProducts.product:id,purchase_unit_price',
            'deliveredProducts.product:id,name,unit',
        ]);

        $dueProductQuantities = $purchaseVoucher->dueProducts
            ->keyBy('product_id');

        $voucherProducts = $purchaseVoucher->voucher?->voucherProducts
            ->map(fn (VoucherProduct $voucherProduct): array => [
                'id' => $voucherProduct->id,
                'product_id' => $voucherProduct->product_id,
                'name' => $voucherProduct->product?->name ?? '—',
                'unit' => $voucherProduct->product?->unit ?? '—',
                'quantity' => max(0, (float) $voucherProduct->quantity - (float) ($dueProductQuantities->get($voucherProduct->product_id)?->quantity ?? 0)),
                'purchase_unit_price' => (float) ($voucherProduct->product?->purchase_unit_price ?? 0),
                'line_total' => round(
                    (float) ($voucherProduct->product?->purchase_unit_price ?? 0)
                    * max(0, (float) $voucherProduct->quantity - (float) ($dueProductQuantities->get($voucherProduct->product_id)?->quantity ?? 0)),
                    2,
                ),
                'status' => (bool) $voucherProduct->status,
            ])
            ->values() ?? collect();

        return Inertia::render('purchase-voucher/view', [
            'purchaseVoucher' => [
                'id' => $purchaseVoucher->id,
                'service_no' => $purchaseVoucher->service_no,
                'name' => $purchaseVoucher->name,
                'phone' => $purchaseVoucher->phone,
                'for_month' => Carbon::parse($purchaseVoucher->for_month)->format('M y'),
                'status' => $purchaseVoucher->status,
                'created_by' => $purchaseVoucher->user?->name ?? '—',
                'voucher' => [
                    'id' => $purchaseVoucher->voucher?->id,
                    'personnel_type' => $purchaseVoucher->voucher?->personnelType?->name ?? '—',
                    'category' => $purchaseVoucher->voucher?->category?->name ?? '—',
                    'products' => $voucherProducts,
                    'total_price' => $voucherProducts->where('status', true)->sum('line_total'),
                ],
                'total_price' => (float) $voucherProducts->where('status', true)->sum('line_total'),
                'raising_cost' => (float) $purchaseVoucher->raising_cost,
                'total_payment' => max(
                    0,
                    (float) $voucherProducts->where('status', true)->sum('line_total')
                    - (float) $purchaseVoucher->raising_cost
                    - (float) $purchaseVoucher->deliveredProducts->sum('total_price'),
                ),
                'delivered_products' => $purchaseVoucher->deliveredProducts->map(fn (DeleveredProduct $deliveredProduct): array => [
                    'id' => $deliveredProduct->id,
                    'product_id' => $deliveredProduct->product_id,
                    'name' => $deliveredProduct->product?->name ?? '—',
                    'unit' => $deliveredProduct->product?->unit ?? '—',
                    'quantity' => (float) $deliveredProduct->quantity,
                    'unit_price' => (float) $deliveredProduct->unit_price,
                    'total_price' => (float) $deliveredProduct->total_price,
                ])->values(),
            ],
        ]);
    }

    /**
     * Record a partial or full product delivery and recalculate payment.
     */
    public function deliver(Request $request, PurchaseVoucher $purchaseVoucher)
    {
        $validated = $request->validate([
            'products' => ['nullable', 'array'],
            'products.*.product_id' => ['sometimes', 'required', 'integer', 'distinct', 'exists:products,id'],
            'products.*.quantity' => ['sometimes', 'required', 'numeric', 'gt:0'],
            'total_payment' => ['required', 'numeric', 'min:0'],
        ]);

        $products = collect($validated['products'] ?? [])
            ->filter(fn (array $delivery): bool => isset($delivery['product_id']) && isset($delivery['quantity']) && (float) $delivery['quantity'] > 0)
            ->values();

        DB::transaction(function () use ($products, $validated, $purchaseVoucher): void {
            $lockedPurchaseVoucher = PurchaseVoucher::query()
                ->lockForUpdate()
                ->findOrFail($purchaseVoucher->id);
            $lockedPurchaseVoucher->loadMissing([
                'voucher.voucherProducts.product:id,purchase_unit_price',
                'dueProducts',
            ]);
            $voucherProducts = $lockedPurchaseVoucher->voucher?->voucherProducts
                ->where('status', true)
                ->keyBy('product_id') ?? collect();
            $dueProductQuantities = $lockedPurchaseVoucher->dueProducts()
                ->pluck('quantity', 'product_id');

            $products->each(function (array $delivery) use ($dueProductQuantities, $voucherProducts): void {
                $voucherProduct = $voucherProducts->get($delivery['product_id']);
                $deliveryQuantity = round((float) $delivery['quantity'], 3);
                $voucherQuantity = round(
                    (float) $voucherProduct?->quantity - (float) ($dueProductQuantities->get($delivery['product_id']) ?? 0),
                    3,
                );

                abort_unless($voucherProduct, 422, 'This product is not available in the voucher.');
                abort_if($deliveryQuantity > $voucherQuantity + 0.0001, 422, 'Delivery quantity exceeds the voucher quantity.');
            });

            DeleveredProduct::query()
                ->where('purchase_voucher_id', $lockedPurchaseVoucher->id)
                ->delete();

            $products->each(function (array $delivery) use ($lockedPurchaseVoucher, $voucherProducts): void {
                $voucherProduct = $voucherProducts->get($delivery['product_id']);
                $unitPrice = (float) $voucherProduct->product?->purchase_unit_price;

                DeleveredProduct::create([
                    'purchase_voucher_id' => $lockedPurchaseVoucher->id,
                    'product_id' => $delivery['product_id'],
                    'quantity' => $delivery['quantity'],
                    'unit_price' => $unitPrice,
                    'total_price' => round($unitPrice * (float) $delivery['quantity'], 2),
                    'status' => true,
                    'created_by' => Auth::id(),
                ]);
            });

            $lockedPurchaseVoucher->update([
                'status' => $products->isNotEmpty() ? 'complete' : $lockedPurchaseVoucher->status,
                'total_payment' => round((float) $validated['total_payment'], 2),
            ]);
        });

        return redirect()->route('purchase-vouchers.index')->with('success', 'Product delivery recorded successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PurchaseVoucher $purchaseVoucher)
    {
        $purchaseVoucher->load([
            'voucher.personnelType:id,name',
            'voucher.category:id,name',
            'voucher.voucherProducts.product:id,name,unit',
            'dueProducts:purchase_voucher_id,product_id',
        ]);
        $vouchers = Voucher::query()
            ->with('personnelType:id,name', 'category:id,name')
            ->get(['id', 'personnel_type_id', 'category_id'])
            ->map(fn (Voucher $voucher): array => [
                'id' => $voucher->id,
                'personnel_type' => $voucher->personnelType?->name ?? '—',
                'category' => $voucher->category?->name ?? '—',
            ]);

        return Inertia::render('purchase-voucher/edit', [
            'purchaseVoucher' => [
                'id' => $purchaseVoucher->id,
                'service_no' => $purchaseVoucher->service_no,
                'name' => $purchaseVoucher->name,
                'phone' => $purchaseVoucher->phone,
                'voucher_id' => $purchaseVoucher->voucher_id,
                'personnel_type' => $purchaseVoucher->voucher?->personnelType?->name ?? '—',
                'voucher_category' => $purchaseVoucher->voucher?->category?->name ?? '—',
                'for_month' => Carbon::parse($purchaseVoucher->for_month)->format('Y-m'),
                'raising_cost' => (float) $purchaseVoucher->raising_cost,
                'status' => $purchaseVoucher->status,
                'if_due_products' => (bool) $purchaseVoucher->if_due_products,
                'due_product_ids' => $purchaseVoucher->dueProducts->pluck('product_id')->values(),
            ],
            'vouchers' => $vouchers,
            'voucherProducts' => $purchaseVoucher->voucher?->voucherProducts
                ->where('status', true)
                ->map(fn (VoucherProduct $voucherProduct): array => [
                    'id' => $voucherProduct->id,
                    'product_id' => $voucherProduct->product_id,
                    'name' => $voucherProduct->product?->name ?? '—',
                    'unit' => $voucherProduct->product?->unit ?? '—',
                    'quantity' => (float) $voucherProduct->quantity,
                ])
                ->values() ?? collect(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PurchaseVoucher $purchaseVoucher)
    {
        if ($request->has('status') && $request->only([
            'service_no',
            'name',
            'phone',
            'voucher_id',
            'for_month',
        ]) === []) {
            $validated = $request->validate([
                'status' => ['required', 'string', 'in:processed,pending,recieved,payment,out-for-delivery,delivered,complete'],
            ]);

            $purchaseVoucher->update($validated);

            return redirect()->route('purchase-vouchers.index')
                ->with('success', 'Purchase voucher status updated successfully.');
        }

        $validated = $request->validate([
            'service_no' => ['required', 'string', 'max:10'],
            'name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'voucher_id' => ['required', 'integer', 'exists:vouchers,id'],
            'for_month' => ['required', 'date_format:Y-m'],
            'raising_cost' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'in:processed,pending,recieved,payment,out-for-delivery,delivered,complete'],
            'if_due_products' => ['nullable', 'boolean'],
            'due_product_ids' => ['nullable', 'array'],
            'due_product_ids.*' => ['integer', 'distinct', 'exists:products,id'],
        ]);

        $request->validate([
            'service_no' => [
                Rule::unique('purchase_vouchers', 'service_no')
                    ->ignore($purchaseVoucher->id)
                    ->where(fn ($query) => $query->where('for_month', $validated['for_month'].'-01')),
            ],
        ]);

        $voucher = Voucher::query()
            ->with('voucherProducts.product:id,purchase_unit_price')
            ->findOrFail($validated['voucher_id']);

        $totalPrice = round($voucher->voucherProducts->where('status', true)->sum(
            fn (VoucherProduct $voucherProduct): float => (float) $voucherProduct->product?->purchase_unit_price * (float) $voucherProduct->quantity,
        ), 2);

        $ifDueProducts = $request->boolean('if_due_products');
        $dueProductIds = collect($validated['due_product_ids'] ?? [])->map(fn (int|string $productId): int => (int) $productId)->values();
        $voucherProductQuantities = $voucher->voucherProducts
            ->where('status', true)
            ->keyBy('product_id');

        abort_unless(
            $ifDueProducts === false || $dueProductIds->every(fn (int $productId): bool => $voucherProductQuantities->has($productId)),
            422,
            'Selected due products must belong to the selected voucher.',
        );

        DB::transaction(function () use ($dueProductIds, $ifDueProducts, $purchaseVoucher, $validated, $totalPrice, $voucherProductQuantities): void {
            $purchaseVoucher->update([
                ...$validated,
                'for_month' => $validated['for_month'].'-01',
                'if_due_products' => $ifDueProducts,
                'total_price' => $totalPrice,
                'total_payment' => max(0, $totalPrice - (float) $validated['raising_cost'] - (float) $purchaseVoucher->deliveredProducts()->where('status', true)->sum('total_price')),
            ]);

            $purchaseVoucher->dueProducts()->delete();

            if ($ifDueProducts) {
                $purchaseVoucher->dueProducts()->createMany(
                    $dueProductIds->map(fn (int $productId): array => [
                        'product_id' => $productId,
                        'quantity' => $voucherProductQuantities->get($productId)->quantity,
                    ])->all(),
                );
            }
        });

        return redirect()->route('purchase-vouchers.index')
            ->with('success', 'Purchase voucher updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseVoucher $purchaseVoucher)
    {
        $purchaseVoucher->delete();

        return response()->json(['message' => 'Purchase voucher deleted successfully.']);
    }
}
