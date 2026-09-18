<?php

namespace App\Http\Controllers;

use App\Models\DeleveredProduct;
use App\Models\PersonnelType;
use App\Models\Product;
use App\Models\PurchaseVoucher;
use App\Models\RationVoucherCategory;
use App\Models\Voucher;
use App\Models\VoucherProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VoucherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('voucher-products/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $personnel_types = PersonnelType::where('status', 1)->get();
        if ($personnel_types->isEmpty()) {
            $personnel_types = PersonnelType::all();
        }
        $voucher_categories = RationVoucherCategory::where('status', 1)->get();
        if ($voucher_categories->isEmpty()) {
            $voucher_categories = RationVoucherCategory::all();
        }
        $products = Product::where('status', 1)->get();
        if ($products->isEmpty()) {
            $products = Product::all();
        }

        return Inertia::render('voucher-products/create', compact('personnel_types', 'voucher_categories', 'products'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = $request->validate([
            'personnel_type_id' => 'required|exists:personnel_types,id',
            'category_id' => 'required|exists:ration_voucher_categories,id',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|distinct|exists:products,id',
            'products.*.quantity' => 'required|numeric|min:0.001',
            'products.*.status' => 'required|boolean',
        ]);

        $userId = Auth::id();

        DB::beginTransaction();
        try {
            // Create Voucher
            $voucher = Voucher::create([
                'personnel_type_id' => $validation['personnel_type_id'],
                'category_id' => $validation['category_id'],
                'product_qty' => count(array_filter($validation['products'], fn (array $product): bool => (bool) $product['status'])),
                'created_by' => $userId,
            ]);

            // Create Voucher Products
            foreach ($validation['products'] as $prod) {
                VoucherProduct::create([
                    'voucher_id' => $voucher->id,
                    'product_id' => $prod['product_id'],
                    'quantity' => $prod['quantity'],
                    'status' => $prod['status'],
                ]);
            }

            DB::commit();

            return redirect()->route('vouchers.index')->with('success', 'Voucher created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Failed to create voucher: '.$e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $data = Voucher::query()
            ->with([
                'personnelType:id,name',
                'category:id,name',
                'voucherProducts.product:id,purchase_unit_price',
            ])
            ->get()
            ->map(fn (Voucher $voucher) => [
                'id' => $voucher->id,
                'personnel_type' => $voucher->personnelType?->name ?? '—',
                'category' => $voucher->category?->name ?? '—',
                'product_qty' => $voucher->voucherProducts->where('status', true)->count(),
                'total_price' => round($voucher->voucherProducts->where('status', true)->sum(
                    fn (VoucherProduct $voucherProduct) => (float) $voucherProduct->product?->purchase_unit_price * (float) $voucherProduct->quantity,
                ), 2),
            ]);

        return response()->json($data);
    }

    /**
     * Display the voucher's product lines.
     */
    public function view(Voucher $voucher)
    {
        $voucher->load([
            'personnelType:id,name',
            'category:id,name',
            'voucherProducts.product:id,name,unit,purchase_unit_price',
        ]);

        return Inertia::render('voucher-products/view', [
            'voucher' => [
                'id' => $voucher->id,
                'personnel_type' => $voucher->personnelType?->name ?? '—',
                'category' => $voucher->category?->name ?? '—',
                'product_qty' => $voucher->voucherProducts->where('status', true)->count(),
                'total_price' => round($voucher->voucherProducts->where('status', true)->sum(
                    fn (VoucherProduct $voucherProduct) => (float) $voucherProduct->product?->purchase_unit_price * (float) $voucherProduct->quantity,
                ), 2),
                'products' => $voucher->voucherProducts->map(fn (VoucherProduct $voucherProduct) => [
                    'id' => $voucherProduct->id,
                    'name' => $voucherProduct->product?->name ?? 'Deleted product',
                    'unit' => $voucherProduct->product?->unit ?? '—',
                    'quantity' => $voucherProduct->quantity,
                    'purchase_unit_price' => $voucherProduct->product?->purchase_unit_price ?? 0,
                    'line_total' => $voucherProduct->status
                        ? round((float) $voucherProduct->product?->purchase_unit_price * (float) $voucherProduct->quantity, 2)
                        : 0,
                    'status' => $voucherProduct->status,
                ]),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Voucher $voucher)
    {
        $voucher->load('voucherProducts:id,voucher_id,product_id,quantity,status');

        return Inertia::render('voucher-products/edit', [
            'voucher' => [
                'id' => $voucher->id,
                'personnel_type_id' => $voucher->personnel_type_id,
                'category_id' => $voucher->category_id,
                'products' => $voucher->voucherProducts->map(fn (VoucherProduct $voucherProduct) => [
                    'product_id' => $voucherProduct->product_id,
                    'quantity' => $voucherProduct->quantity,
                    'status' => $voucherProduct->status,
                ]),
            ],
            'personnel_types' => PersonnelType::all(['id', 'name']),
            'voucher_categories' => RationVoucherCategory::all(['id', 'name']),
            'products' => Product::all(['id', 'name', 'unit', 'purchase_unit_price']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Voucher $voucher)
    {
        $validation = $request->validate([
            'personnel_type_id' => 'required|exists:personnel_types,id',
            'category_id' => 'required|exists:ration_voucher_categories,id',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|distinct|exists:products,id',
            'products.*.quantity' => 'required|numeric|min:0.001',
            'products.*.status' => 'required|boolean',
        ]);

        try {
            DB::transaction(function () use ($voucher, $validation): void {
                $voucher->update([
                    'personnel_type_id' => $validation['personnel_type_id'],
                    'category_id' => $validation['category_id'],
                    'product_qty' => count(array_filter($validation['products'], fn (array $product): bool => (bool) $product['status'])),
                ]);

                $voucher->voucherProducts()->delete();
                $voucher->voucherProducts()->createMany($validation['products']);
            });

            return redirect()->route('vouchers.index')->with('success', 'Voucher updated successfully.');
        } catch (\Throwable $exception) {
            return back()->withErrors(['error' => 'Failed to update voucher: '.$exception->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, int $id)
    {
        $voucher = Voucher::findOrFail($id);

        $voucher->delete();

        return response()->json(['message' => 'Voucher deleted successfully.']);
    }

    public function customerVouchers()
    {

        return Inertia::render('customer-vouchers/index');
    }

    public function customerOrders()
    {
        $serviceNo = Auth::user()?->profile?->service_no;

        $orders = $serviceNo
            ? PurchaseVoucher::query()
                ->with([
                    'voucher.category:id,name',
                    'deliveredProducts.product:id,name,unit',
                ])
                ->where('service_no', $serviceNo)
                ->whereHas('deliveredProducts', fn ($query) => $query->where('status', true))
                ->orderBy('for_month', 'desc')
                ->get()
                ->map(fn (PurchaseVoucher $purchaseVoucher): array => [
                    'id' => $purchaseVoucher->id,
                    'category' => $purchaseVoucher->voucher?->category?->name ?? '—',
                    'for_month' => $purchaseVoucher->for_month?->format('F Y'),
                    'status' => $purchaseVoucher->status,
                    'updated_at' => $purchaseVoucher->updated_at?->format('d M Y, h:i A'),
                    'total_price' => (float) $purchaseVoucher->total_price,
                    'raising_cost' => (float) $purchaseVoucher->raising_cost,
                    'total_payment' => (float) $purchaseVoucher->total_payment,
                    'products' => $purchaseVoucher->deliveredProducts
                        ->where('status', true)
                        ->map(fn (DeleveredProduct $deliveredProduct): array => [
                            'name' => $deliveredProduct->product?->name ?? '—',
                            'unit' => $deliveredProduct->product?->unit ?? '—',
                            'quantity' => (float) $deliveredProduct->quantity,
                            'unit_price' => (float) $deliveredProduct->unit_price,
                            'total_price' => (float) $deliveredProduct->total_price,
                        ])
                        ->values(),
                ])
                ->values()
            : collect();

        return Inertia::render('customer-orders/index', [
            'orders' => $orders,
        ]);
    }

    public function voucherList()
    {
        $serviceNo = Auth::user()?->profile?->service_no;

        if (! $serviceNo) {
            return response()->json([
                'message' => 'Your customer profile does not have a service number.',
            ], 422);
        }

        $vouchers = PurchaseVoucher::query()
            ->with([
                'voucher.personnelType:id,name',
                'voucher.category:id,name',
                'voucher.voucherProducts.product:id,name,unit,purchase_unit_price',
            ])
            ->where('service_no', $serviceNo)
            ->latest('for_month')
            ->latest('id')
            ->get()
            ->map(fn (PurchaseVoucher $purchaseVoucher): array => [
                'id' => $purchaseVoucher->id,
                'service_no' => $purchaseVoucher->service_no,
                'name' => $purchaseVoucher->name,
                'phone' => $purchaseVoucher->phone,
                'personnel_type' => $purchaseVoucher->voucher?->personnelType?->name ?? '—',
                'category' => $purchaseVoucher->voucher?->category?->name ?? '—',
                'for_month' => $purchaseVoucher->for_month?->format('F Y'),
                'total_price' => (float) $purchaseVoucher->total_price,
                'raising_cost' => (float) $purchaseVoucher->raising_cost,
                'total_payment' => (float) $purchaseVoucher->total_payment,
                'status' => $purchaseVoucher->status,
                'products' => $purchaseVoucher->voucher?->voucherProducts
                    ->where('status', true)
                    ->map(fn (VoucherProduct $voucherProduct): array => [
                        'product_id' => $voucherProduct->product_id,
                        'name' => $voucherProduct->product?->name ?? '—',
                        'unit' => $voucherProduct->product?->unit ?? '—',
                        'quantity' => (float) $voucherProduct->quantity,
                        'unit_price' => (float) ($voucherProduct->product?->purchase_unit_price ?? 0),
                    ])
                    ->values()
                    ->all() ?? [],
            ]);

        return response()->json($vouchers);
    }

    public function order(Request $request, PurchaseVoucher $purchaseVoucher)
    {
        $serviceNo = Auth::user()?->profile?->service_no;

        abort_unless($serviceNo && $purchaseVoucher->service_no === $serviceNo, 403);
        abort_unless($purchaseVoucher->status === 'recieved', 422, 'This voucher is not ready to order.');

        $validated = $request->validate([
            'products' => ['required', 'array', 'min:1'],
            'products.*.product_id' => ['required', 'integer', 'distinct', 'exists:products,id'],
            'products.*.quantity' => ['required', 'numeric', 'gt:0'],
        ]);

        DB::transaction(function () use ($purchaseVoucher, $validated): void {
            $lockedPurchaseVoucher = PurchaseVoucher::query()
                ->lockForUpdate()
                ->with('voucher.voucherProducts.product:id,purchase_unit_price')
                ->findOrFail($purchaseVoucher->id);

            abort_unless($lockedPurchaseVoucher->status === 'recieved', 422, 'This voucher is not ready to order.');

            $voucherProducts = $lockedPurchaseVoucher->voucher?->voucherProducts
                ->where('status', true)
                ->keyBy('product_id') ?? collect();
            $orderProducts = collect($validated['products']);

            $orderProducts->each(function (array $orderProduct) use ($voucherProducts): void {
                $voucherProduct = $voucherProducts->get($orderProduct['product_id']);
                $orderQuantity = round((float) $orderProduct['quantity'], 3);
                $originalQuantity = round((float) $voucherProduct?->quantity ?? 0, 3);

                abort_unless($voucherProduct, 422, 'This product is not available in the voucher.');
                abort_if($orderQuantity > $originalQuantity + 0.0001, 422, 'Order quantity exceeds the voucher quantity.');
            });

            DeleveredProduct::query()
                ->where('purchase_voucher_id', $lockedPurchaseVoucher->id)
                ->delete();

            $orderTotal = 0;
            $orderProducts->each(function (array $orderProduct) use ($lockedPurchaseVoucher, $voucherProducts, &$orderTotal): void {
                $unitPrice = (float) $voucherProducts->get($orderProduct['product_id'])->product?->purchase_unit_price;
                $quantity = round((float) $orderProduct['quantity'], 3);
                $lineTotal = round($unitPrice * $quantity, 2);
                $orderTotal += $lineTotal;

                DeleveredProduct::create([
                    'purchase_voucher_id' => $lockedPurchaseVoucher->id,
                    'product_id' => $orderProduct['product_id'],
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $lineTotal,
                    'status' => true,
                    'created_by' => Auth::id(),
                ]);
            });

            $lockedPurchaseVoucher->update([
                'status' => 'processed',
                'total_payment' => max(0, round((float) $lockedPurchaseVoucher->total_price - (float) $lockedPurchaseVoucher->raising_cost - $orderTotal, 2)),
            ]);
        });

        return redirect()->route('customer-vouchers.index')->with('success', 'Your voucher order was submitted successfully.');
    }
}
