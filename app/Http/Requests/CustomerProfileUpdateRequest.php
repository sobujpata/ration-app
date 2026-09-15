<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CustomerProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'service_no' => ['nullable', 'string', 'max:11'],
            'cus_add' => ['required', 'string', 'max:500'],
            'cus_city' => ['nullable', 'string', 'max:50'],
            'cus_state' => ['nullable', 'string', 'max:50'],
            'cus_postcode' => ['nullable', 'string', 'max:50'],
            'cus_country' => ['nullable', 'string', 'max:50'],
            'cus_phone' => ['required', 'string', 'max:50'],
            'cus_fax' => ['nullable', 'string', 'max:50'],
            'ship_name' => ['nullable', 'string', 'max:100'],
            'ship_add' => ['nullable', 'string', 'max:100'],
            'ship_city' => ['nullable', 'string', 'max:100'],
            'ship_state' => ['nullable', 'string', 'max:100'],
            'ship_postcode' => ['nullable', 'string', 'max:100'],
            'ship_country' => ['nullable', 'string', 'max:100'],
            'ship_phone' => ['required', 'string', 'max:50'],
        ];
    }
}
