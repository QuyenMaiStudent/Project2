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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('payments')->onDelete('cascade');
            $table->string('gateway');
            $table->string('transaction_code')->unique();
            $table->enum('status', ['success', 'failed', 'pending'])->default('pending');
            $table->decimal('amount', 12, 2);
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index('payment_id');
            $table->index('status');
            $table->index('processed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
