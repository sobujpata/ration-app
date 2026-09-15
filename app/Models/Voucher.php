<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $fillable = [
        'personnel_type_id',
        'category_id',
        'product_qty',
        'created_by',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    public function personnelType()
    {
        return $this->belongsTo(
            PersonnelType::class,
            'personnel_type_id'
        );
    }

    public function category()
    {
        return $this->belongsTo(
            RationVoucherCategory::class,
            'category_id'
        );
    }

    public function voucherProducts()
    {
        return $this->hasMany(
            VoucherProduct::class,
            'voucher_id'
        );
    }

    public function createdBy()
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }
}
