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
        'status',
        'created_by',
    ];

    public function voucher()
    {
        return $this->belongsTo(Voucher::class, 'voucher_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
