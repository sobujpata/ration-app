<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VoucherProduct extends Model
{
    protected $fillable = [
        'voucher_id',
        'product_id',
        'quantity',
        'status',
        'created_by',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'total_price' => 'decimal:2',
        'status' => 'boolean',
    ];

    public function voucher()
    {
        return $this->belongsTo(Voucher::class, 'voucher_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(
            Product::class,
            'product_id'
        );
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }
}
