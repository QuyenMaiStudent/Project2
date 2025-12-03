<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->boolean('pinned')->default(false)->after('status')->index();
            $table->unsignedInteger('likes_count')->default(0)->after('pinned');
            $table->unsignedInteger('replies_count')->default(0)->after('likes_count');
            $table->timestamp('edited_at')->nullable()->after('updated_at');
        });
    }

    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropColumn(['pinned', 'likes_count', 'replies_count', 'edited_at']);
        });
    }
};