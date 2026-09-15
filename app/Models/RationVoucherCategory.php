<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RationVoucherCategory extends Model
{
    protected $fillable = [
        'name',
        'description',
        'status',
        'created_by',
    ];

    protected $casts = [
        'voucher_value' => 'decimal:2',
        'purchase_price' => 'decimal:2',
        'status' => 'boolean',
    ];

    public function products()
    {
        return $this->hasMany(
            RationVoucherCategoryProduct::class
        );
    }

    public function vouchers()
    {
        return $this->hasMany(
            RationVoucher::class
        );
    }

    public function creator()
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }
}
