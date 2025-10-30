<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: Change to VARCHAR first
        DB::statement("ALTER TABLE transactions MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending'");
        
        // Step 2: Update existing data to new values
        DB::statement("
            UPDATE transactions 
            SET status = CASE 
                WHEN status = 'success' THEN 'succeeded'
                WHEN status = 'failed' THEN 'failed'
                WHEN status = 'pending' THEN 'pending'
                ELSE 'pending'
            END
        ");
        
        // Step 3: Change to new ENUM with consistent values
        DB::statement("
            ALTER TABLE transactions 
            MODIFY COLUMN status ENUM('pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded') 
            NOT NULL DEFAULT 'pending'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE transactions MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending'");
        
        DB::statement("
            UPDATE transactions 
            SET status = CASE 
                WHEN status = 'succeeded' THEN 'success'
                WHEN status = 'failed' THEN 'failed'
                WHEN status = 'pending' THEN 'pending'
                ELSE 'pending'
            END
        ");
        
        DB::statement("
            ALTER TABLE transactions 
            MODIFY COLUMN status ENUM('success', 'failed', 'pending') 
            NOT NULL DEFAULT 'pending'
        ");
    }
};
