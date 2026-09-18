<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseVoucher extends Model
{
    protected $fillable = [
        'service_no',
        'name',
        'phone',
        'voucher_id',
        'for_month',
        'total_price',
        'raising_cost',
        'total_payment',
        'status',
        'created_by',
    ];

    protected $casts = [
        'for_month' => 'date',
        'total_price' => 'decimal:2',
        'raising_cost' => 'decimal:2',
        'total_payment' => 'decimal:2',
    ];

    public function voucher()
    {
        return $this->belongsTo(Voucher::class, 'voucher_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function deliveredProducts()
    {
        return $this->hasMany(DeleveredProduct::class, 'purchase_voucher_id');
    }
}
