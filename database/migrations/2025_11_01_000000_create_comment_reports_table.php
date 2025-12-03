<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comment_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('comment_id')->constrained('comments')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // reporter optional
            $table->string('reason')->nullable();
            $table->text('details')->nullable();
            $table->enum('status', ['pending', 'reviewed', 'dismissed'])->default('pending');
            $table->timestamps();

            $table->index('comment_id');
            $table->index('user_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comment_reports');
    }
};