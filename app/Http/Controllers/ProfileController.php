<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerProfileUpdateRequest;
use App\Models\CustomerProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('profile/index', [
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
            'cusProfile' => $request->user()->profile,
        ]);
    }

    public function update(CustomerProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        DB::transaction(function () use ($validated, $user): void {
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            CustomerProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    ...collect($validated)->except(['name', 'email'])->all(),
                    'cus_name' => $validated['name'],
                ],
            );
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return back();
    }
}
