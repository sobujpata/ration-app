<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purchase_vouchers', function (Blueprint $table): void {
            if (! Schema::hasColumn('purchase_vouchers', 'total_price')) {
                $table->decimal('total_price', 10, 2)->default('0.00');
            }

            if (! Schema::hasColumn('purchase_vouchers', 'raising_cost')) {
                $table->decimal('raising_cost', 10, 2)->default('0.00');
            }

            if (! Schema::hasColumn('purchase_vouchers', 'total_payment')) {
                $table->decimal('total_payment', 10, 2)->default('0.00');
            }
        });
    }

    public function down(): void
    {
        // These columns are also part of the original table definition for fresh installations.
    }
};
