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
        Schema::table('product_images', function (Blueprint $table) {
            if (!Schema::hasColumn('product_images', 'product_variant_id')) {
                $table->unsignedBigInteger('product_variant_id')->nullable()->after('product_id');
                $table->foreign('product_variant_id')->references('id')->on('product_variants')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            if (Schema::hasColumn('product_images', 'product_variant_id')) {
                $table->dropForeign(['product_variant_id']);
                $table->dropColumn('product_variant_id');
            }
        });
    }
};
