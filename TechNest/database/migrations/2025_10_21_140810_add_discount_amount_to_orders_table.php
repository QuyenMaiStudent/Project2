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
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('discount_amount', 10, 2)->default(0)->after('total_amount');
            $table->foreignId('promotion_id')->nullable()->constrained('promotions')->onDelete('set null')->after('discount_amount');
            $table->foreignId('shipping_address_id')->nullable()->constrained('shipping_addresses')->onDelete('set null')->after('promotion_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['discount_amount', 'promotion_id', 'shipping_address_id']);
        });
    }
};
