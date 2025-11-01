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
        Schema::table('provinces', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->after('code');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });

        Schema::table('districts', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->after('code');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });

        Schema::table('wards', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->after('code');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('provinces', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });

        Schema::table('provinces', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });

        Schema::table('provinces', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
