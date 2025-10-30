<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: First change to VARCHAR to allow any values
        DB::statement("ALTER TABLE payments MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending'");
        
        // Step 2: Now update existing data to match new enum values
        DB::statement("
            UPDATE payments 
            SET status = CASE 
                WHEN status IN ('success', 'completed', 'paid') THEN 'succeeded'
                WHEN status IN ('processing', 'waiting') THEN 'pending'
                WHEN status IN ('error', 'declined') THEN 'failed'
                WHEN status IN ('cancelled', 'voided') THEN 'canceled'
                WHEN status = 'refund' THEN 'refunded'
                ELSE 'pending'
            END
        ");
        
        // Step 3: Update any remaining problematic values to 'pending'
        DB::statement("
            UPDATE payments 
            SET status = 'pending' 
            WHERE status NOT IN ('pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded')
        ");
        
        // Step 4: Now change to the new ENUM safely
        DB::statement("
            ALTER TABLE payments 
            MODIFY COLUMN status ENUM('pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded') 
            NOT NULL DEFAULT 'pending'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Step 1: Change to VARCHAR first
        DB::statement("ALTER TABLE payments MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending'");
        
        // Step 2: Map back to old enum values
        DB::statement("
            UPDATE payments 
            SET status = CASE 
                WHEN status = 'succeeded' THEN 'paid'
                WHEN status = 'canceled' THEN 'cancelled'
                WHEN status = 'refunded' THEN 'failed'
                ELSE status
            END
        ");
        
        // Step 3: Change back to original enum (adjust these values based on your original enum)
        DB::statement("
            ALTER TABLE payments 
            MODIFY COLUMN status ENUM('pending', 'paid', 'failed', 'cancelled') 
            NOT NULL DEFAULT 'pending'
        ");
    }
};
