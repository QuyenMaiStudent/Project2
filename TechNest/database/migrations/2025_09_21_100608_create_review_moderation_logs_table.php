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
        Schema::create('review_moderation_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('review_id')->constrained('reviews')->onDelete('cascade');
            $table->foreignId('moderator_id')->constrained('users')->onDelete('cascade');
            $table->enum('action', ['approved', 'rejected']);
            $table->text('note')->nullable();
            $table->timestamps();

            $table->index('review_id');
            $table->index('moderator_id');
            $table->index('action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('review_moderation_logs');
    }
};
