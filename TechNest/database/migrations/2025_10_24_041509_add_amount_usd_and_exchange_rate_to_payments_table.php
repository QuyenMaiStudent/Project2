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
        Schema::table('payments', function (Blueprint $table) {
            $table->decimal('amount_usd', 10, 2)->nullable()->after('amount');
            $table->decimal('exchange_rate', 18, 12)->nullable()->after('amount_usd');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('amount_usd');
            $table->dropColumn('exchange_rate');
        });
    }
};
