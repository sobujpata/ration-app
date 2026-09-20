<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'customer_id',
        'grand_total',
        'paid_amount',
        'due_amount',
        'status',
        'created_by',
    ];

    protected $casts = [
        'grand_total' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'due_amount' => 'decimal:2',
    ];

    public function products()
    {
        return $this->hasMany(InvoiceProduct::class);
    }

    // customer will be nullable and if customer have user id
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
}
