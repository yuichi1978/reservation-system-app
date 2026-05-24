<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * このテーブルの目的
 * 
 * 何曜日は何時から何時まで営業しているかを管理する
 */

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        /**
         * Schema::create() = 新しいーテーブルを作成する
         * 第1引数：テーブル名
         * 第2引数：カラムの定義 (Blueprint $table で書く)
         * 
         */
        Schema::create('schedules', function (Blueprint $table) {
            /**
             * $table->id()
             * = id という名前のキーカラムを作る
             * 
             * $table->unsignedTinyInteger = 0~255の小さな整数
             * 　-> 曜日は 0~6 しか使わないので tink でOK
             * 　-> unsigned = マイナスを許可しない
             * 
             * 曜日の対応： 0=日、1=月、2=火, 3=水、4=木、5=金、6=土
             * 
             * open_time / close_time カラム (営業時間)
             * 
             * time型 = 時刻だけを保存する型 (例：　”10::00:00”)
             * *date型は日付だけ、datetime型は日付＋時刻
             * 
             * ->nullable()
             * = 定休日の場合はNULを入れるので必要
             * -> 「定休日 = NULLが入っている曜日」と判断できる
             * 
             * is_holiday　カラム　(定休日フラグ)
             * 
             * boolean型 = trueかfalseしか入らない型
             * -> true = 定休日 (予約不可)
             * -> false = 営業日 (予約可)
             * 
             * ->default(false)
             * = 最初は「営業日」として登録される
             * 
             * slot_interval_minutes カラム (予約枠の間隔)
             * 
             * unsignedSmallInterger = 0~65535の整数
             * -> 15分・30分・60分などを入れる
             * 
             * ->default(30) = 初期値は30分間隔
             * 
             * max_slots カラム (同時時間帯の最大予約数)
             * 
             * 例：1 = 同じ時間に1人しか予約できない
             *    3 = 同じ時間に最大3人まで予約できる
             * 
             * $table->unique('dat_of_week')
             * = day_of_week カラムに [ユニーク制約]を設定する
             * -> 同じ曜日が2回登録されることを防ぐ
             * -> 月曜日のデータが2行あったらバグなので！
             * 
             */
            $table->id();
            $table->unsignedTinyInteger('day_of_week');
            $table->time('open_time')->nullable();
            $table->time('close_time')->nullable();
            $table->boolean('is_holiday')->default(false);
            $table->unsignedSmallInteger('slot_interval_minutes')->default(30);
            $table->unsignedSmallInteger('max_slots')->default(1);
            $table->unique('day_of_week');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
