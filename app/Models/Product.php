<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'unit',
        'quantity',
        'purchase_unit_price',
        'sale_unit_price',
        'sku',
        'status',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
    ];
}
