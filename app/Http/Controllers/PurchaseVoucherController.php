<?php

namespace App\Http\Controllers;

use App\Models\PurchaseVoucher;
use App\Models\Voucher;
use App\Models\VoucherProduct;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            'status' => ['required', 'string', 'in:processed,pending,recieved,payment,complete'],
        ]);

        PurchaseVoucher::create([
            ...$validated,
            'for_month' => $validated['for_month'].'-01',
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
                'user:id,name',
            ])
            ->get()
            ->map(fn (PurchaseVoucher $purchaseVoucher): array => [
                'id' => $purchaseVoucher->id,
                'service_no' => $purchaseVoucher->service_no,
                'name' => $purchaseVoucher->name,
                'phone' => $purchaseVoucher->phone,
                'voucher_category' => $purchaseVoucher->voucher?->category?->name ?? '—',
                'total_price' => round($purchaseVoucher->voucher?->voucherProducts
                    ->where('status', true)
                    ->sum(fn (VoucherProduct $voucherProduct): float => (float) $voucherProduct->product?->purchase_unit_price * (float) $voucherProduct->quantity) ?? 0, 2),
                'for_month' => Carbon::parse($purchaseVoucher->for_month)->format('M y'),
                'status' => $purchaseVoucher->status,
                'created_by' => $purchaseVoucher->user?->name ?? '—',
            ]);

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
        ]);

        $voucherProducts = $purchaseVoucher->voucher?->voucherProducts
            ->map(fn (VoucherProduct $voucherProduct): array => [
                'id' => $voucherProduct->id,
                'name' => $voucherProduct->product?->name ?? '—',
                'unit' => $voucherProduct->product?->unit ?? '—',
                'quantity' => (float) $voucherProduct->quantity,
                'purchase_unit_price' => (float) ($voucherProduct->product?->purchase_unit_price ?? 0),
                'line_total' => round((float) ($voucherProduct->product?->purchase_unit_price ?? 0) * (float) $voucherProduct->quantity, 2),
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
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PurchaseVoucher $purchaseVoucher)
    {
        $purchaseVoucher->load('voucher.personnelType:id,name', 'voucher.category:id,name');
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
                'status' => $purchaseVoucher->status,
            ],
            'vouchers' => $vouchers,
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
                'status' => ['required', 'string', 'in:processed,pending,recieved,payment,complete'],
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
            'status' => ['required', 'string', 'in:processed,pending,recieved,payment,complete'],
        ]);

        $purchaseVoucher->update([
            ...$validated,
            'for_month' => $validated['for_month'].'-01',
        ]);

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
