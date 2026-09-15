<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('products/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('products/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = $request->validate([
            'name' => 'required|string',
            'unit' => 'required|string',
            'quantity' => 'required|numeric|min:0',
            'purchase_unit_price' => 'required|string',
            'sale_unit_price' => 'nullable|string',
            'status' => 'required|string',
        ]);
        $sku = strtoupper(uniqid(4));
        Product::create([
            'name' => $validation['name'],
            'unit' => $validation['unit'],
            'quantity' => $validation['quantity'],
            'purchase_unit_price' => $validation['purchase_unit_price'],
            'sale_unit_price' => $validation['sale_unit_price'],
            'sku' => $sku,
            'status' => $validation['status'],
        ]);

        return Inertia::render('products/index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $products = Product::all();

        return response()->json($products);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, int $id)
    {
        $product = Product::findOrFail($id);

        return Inertia::render('products/edit', compact('product'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $validation = $request->validate([
            'name' => 'required|string',
            'unit' => 'required|string',
            'quantity' => 'required|numeric|min:0',
            'purchase_unit_price' => 'required|string',
            'sale_unit_price' => 'nullable|string',
            'status' => 'required|string',
        ]);
        $sku = strtoupper(uniqid(4));
        $product = Product::findOrFail($id);
        $product->update([
            'name' => $validation['name'],
            'unit' => $validation['unit'],
            'quantity' => $validation['quantity'],
            'purchase_unit_price' => $validation['purchase_unit_price'],
            'sale_unit_price' => $validation['sale_unit_price'],
            'sku' => $sku,
            'status' => $validation['status'],
        ]);

        return Inertia::render('products/index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, int $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message', 'Deleted successfully!']);
    }
}
