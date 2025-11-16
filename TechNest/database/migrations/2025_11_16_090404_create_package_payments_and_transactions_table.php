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
        Schema::create('package_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('gateway', 40);
            $table->string('status', 30)->default('pending');
            $table->decimal('amount', 15, 2);
            $table->string('currency', 10)->default('VND');
            $table->decimal('exchange_rate', 15, 6)->nullable();
            $table->string('reference')->nullable();
            $table->string('external_id')->nullable();
            $table->string('transaction_code')->nullable();
            $table->json('metadata')->nullable();
            $table->json('raw_response')->nullable();
            $table->string('return_url')->nullable();
            $table->string('cancel_url')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['gateway', 'status']);
        });

        Schema::create('package_payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_payment_id')->constrained('package_payments')->cascadeOnDelete();
            $table->string('gateway', 40);
            $table->string('status', 30);
            $table->string('type', 40)->nullable();
            $table->string('transaction_code')->nullable();
            $table->decimal('amount', 15, 2)->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->json('payload')->nullable();
            $table->timestamps();

            $table->index(['package_payment_id', 'status']);
            $table->index(['transaction_code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_payment_transactions');
        Schema::dropIfExists('package_payments');
    }
};
