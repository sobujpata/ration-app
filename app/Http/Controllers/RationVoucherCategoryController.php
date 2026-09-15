<?php

namespace App\Http\Controllers;

use App\Models\RationVoucherCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RationVoucherCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('ration-voucher-category/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ration-voucher-category/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user_id = Auth::user()->id;
        $validation = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'status' => 'required|string',
        ]);

        RationVoucherCategory::create([
            'name' => $validation['name'],
            'description' => $validation['description'],
            'status' => $validation['status'],
            'created_by' => $user_id,
        ]);

        return Inertia::render('ration-voucher-category/index');
    }

    /**
     * Display the specified resource.
     */
    public function show(RationVoucherCategory $rationVoucherCategory)
    {
        $categories = RationVoucherCategory::all();

        return response()->json($categories);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, int $id)
    {
        $data = RationVoucherCategory::findOrFail($id);

        return Inertia::render('ration-voucher-category/edit', compact('data'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $user_id = Auth::user()->id;
        $validation = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'required|string',
        ]);
        $rationVoucherCategory = RationVoucherCategory::findOrFail($id);
        $rationVoucherCategory->update([
            'name' => $validation['name'],
            'description' => $validation['description'],
            'status' => $validation['status'],
            'created_by' => $user_id,
        ]);

        return Inertia::render('ration-voucher-category/index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, int $id)
    {
        $rationVoucherCategory = RationVoucherCategory::findOrFail($id);

        $rationVoucherCategory->delete();

        return response()->json(['message', 'Deleted successfully!']);
    }
}
