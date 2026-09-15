<?php

namespace App\Http\Controllers;

use App\Models\PersonnelType;
use App\Models\Product;
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
}
