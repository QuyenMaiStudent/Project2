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
            $table->string('provider')->default('stripe')->after('payment_method_id');
            $table->string('transaction_id')->nullable()->after('transaction_code');
            $table->json('raw_payload')->nullable()->after('transaction_id');
            $table->string('gateway_event_id')->nullable()->after('raw_payload');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['provider', 'transaction_id', 'raw_payload', 'gateway_event_id']);
        });
    }
};
