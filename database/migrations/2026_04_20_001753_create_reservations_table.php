<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * このテーブルの目的
 * 
 * 誰が・いつ・どんな状態で予約しているのかを管理する
 * 
 * 例えばこんなデータが入る
 * 
 * user_id reserved_at end_at status
 * 
 * [ステータスの流れ]
 * 
 * pending (仮予約)
 * ↓　管理者が確定
 * confirmed (予約確定)
 * ↓　予約日が来て完了
 * 
 */

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->dateTime('reserved_at');
            $table->dateTime('end_at');
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index('reserved_at');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
