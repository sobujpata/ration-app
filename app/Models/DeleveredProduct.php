<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeleveredProduct extends Model
{
    protected $table = 'delevered_products';

    protected $fillable = [
        'purchase_voucher_id',
        'product_id',
        'quantity',
        'unit_price',
        'total_price',
        'status',
        'created_by',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'status' => 'boolean',
    ];

    public function purchaseVoucher()
    {
        return $this->belongsTo(PurchaseVoucher::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
