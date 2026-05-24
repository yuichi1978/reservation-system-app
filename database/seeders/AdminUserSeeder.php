<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /**
         * User::updateOrCreate() の使い方
         * 
         * 第1引数：検索条件 (このメールアドレスで探す)
         * 第2引数：作成・更新するデータ
         * 
         * 「email = admin@example.com のユーザーを探す」
         * →　見つかった場合：第2引数の内容を更新する
         * →　見つからない場合：第1引数　＋　第2引数データを作成する
         * 
         * この書き方なら[php artisan db:seed]を何度実行しても
         */
        User::updateOrCreate(
            // 検索条件 (このemailで探す)
            ['email' => 'admin@example.com'],
            // 作成・更新するデータ
            [
                // Hash::make() = パスワードをハッシュ化する
                // 絶対にパスワードを平文 (そのまま) DBに保存してはいけない！
                // now() = 現在日時を返す Laravel のヘルパー関数
                // これを設定することで「メール認証済み」の状態になる
                'name'              =>  '管理者',
                'password'          => Hash::make('password'),
                'role'              => 'admin',
                'phone'             => '000-0000-0000',
                'email_verified_at' => now(),
            ]
        );

        // ターミナルに完了メッセージを表示する
        $this->command->info('管理者ユーザーを作成しました');
        $this->command->info('ログインEmail: admin@example.com');
        $this->command->info('パスワード: password <- 本番環境では必ず変更！');
    }
}
