<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('delevered_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('purchase_voucher_id');
            $table->foreign('purchase_voucher_id')->references('id')->on('purchase_vouchers')->cascadeOnUpdate()->cascadeOnDelete();
            $table->unsignedBigInteger('product_id');
            $table->foreign('product_id')->references('id')->on('products')->cascadeOnUpdate()->cascadeOnDelete();
            $table->decimal('quantity', 10, 2)->default('0.00');
            $table->decimal('unit_price', 10, 2)->default('0.00');
            $table->decimal('total_price', 10, 2)->default('0.00');
            $table->boolean('status')->default(false);
            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')->references('id')->on('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delevered_products');
    }
};
