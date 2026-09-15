<?php

namespace App\Http\Controllers;

use App\Models\PersonnelType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PersonnelTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('personnel-types/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('personnel-types/index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'status' => 'required|string',
        ]);

        PersonnelType::create([
            'name' => $validation['name'],
            'description' => $validation['description'],
            'status' => $validation['status'],
        ]);

        return Inertia::render('personnel-types/index');
    }

    /**
     * Display the specified resource.
     */
    public function show(PersonnelType $personnelType)
    {
        $data = PersonnelType::all();

        return response()->json($data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, int $id)
    {
        $data = PersonnelType::findOrFail($id);

        return Inertia::render('ration-voucher-category/edit', compact('data'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $validation = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'required|string',
        ]);
        $personnelType = PersonnelType::findOrFail($id);
        $personnelType->update([
            'name' => $validation['name'],
            'description' => $validation['description'],
            'status' => $validation['status'],
        ]);

        return Inertia::render('personnel-types/index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, int $id)
    {
        $personnelType = PersonnelType::findOrFail($id);

        $personnelType->delete();

        return response()->json(['message', 'Deleted successfully!']);
    }
}
