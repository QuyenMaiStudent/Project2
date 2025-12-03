<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::statement("ALTER TABLE `orders` 
            MODIFY `status` ENUM(
                'draft',
                'placed',
                'paid',
                'processing',
                'ready_to_ship',
                'shipped',
                'delivered',
                'cancelled'
            ) NOT NULL DEFAULT 'draft'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE `orders` 
            MODIFY `status` ENUM(
                'draft',
                'placed',
                'paid',
                'processing',
                'shipped',
                'delivered',
                'cancelled'
            ) NOT NULL DEFAULT 'draft'");
    }
};