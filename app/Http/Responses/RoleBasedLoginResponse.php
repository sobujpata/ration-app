<?php

namespace App\Http\Responses;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse;

class RoleBasedLoginResponse implements LoginResponse
{
    /**
     * Create the response after successful authentication.
     */
    public function toResponse($request): RedirectResponse
    {
        /** @var Request $request */
        if (! $request->user()?->hasAnyRole(['Super Admin', 'Admin'])) {
            return redirect()->route('home');
        }

        return redirect()->intended(route('dashboard'));
    }
}
