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
        // Thêm 'paid' vào enum status của orders
        DB::statement("
            ALTER TABLE orders 
            MODIFY COLUMN status ENUM(
                'draft', 'placed', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'
            ) DEFAULT 'draft'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Trước khi xóa 'paid', cập nhật tất cả records có status 'paid' thành 'processing'
        DB::statement("UPDATE orders SET status = 'processing' WHERE status = 'paid'");
        
        // Khôi phục enum cũ
        DB::statement("
            ALTER TABLE orders 
            MODIFY COLUMN status ENUM(
                'draft', 'placed', 'processing', 'shipped', 'delivered', 'cancelled'
            ) DEFAULT 'draft'
        ");
    }
};
