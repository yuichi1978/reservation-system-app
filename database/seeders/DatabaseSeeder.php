<?php

namespace Database\Seeders;

/**
 * Seederとは？
 * 
 * データベースに「初期データ」を投入するクラスです。
 * 
 * 用途：
 *  - 開発環境のテスト用データ
 *  - 本番環境の初期設定データ ()
 * 
 * [DatabaseSeederの役割]
 * 他のSeederを呼び出す「司令塔」です。
 * php artisan db:seed を実行すると、このファイルが最初に動きます。
 * 
 *  [実行するコマンド]
 * php artisan db:seed
 */

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        /**
         * $this->call([]) = 他のSeederを順番に呼び出す
         * 
         * 順番が大事！
         * ① AdminUserSeeder (管理者ユーザーを先に作る)
         * ② ScheduleSeeder (営業時間を設定する)
         * 
         * reservations テーブルはuser_idが必要なので、
         * ユーザーを先に作る必要があります。
         * 
         */

        $this->call([
            AdminUserSeeder::class, // ①管理者ユーザーを作成
            ScheduleSeeder::class,  // ②週7日分の営業時間を設定 
        ]);

        // 先にユーザーを作っておく (予約にはユーザーが必要なため)
        User::factory(10)->create();

        // [追加] 予約データを5件作成する
        Reservation::factory(5)->recycle(User::all())->create();
    }
}
