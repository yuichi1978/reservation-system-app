<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * migrationとは？
 * 
 * データベースのテーブル設計書です。
 * PHPのコードでテーブルの構造を定義します。
 * 
 * 【なぜコードで書くのか？】
 * SQLを直接書くよりも管理しやすく、チームで共有できるからです。
 * gitでのバージョン管理もできます。
 * 
 * 【up() と　down() の役割】
 * up() = php artisan migrateを実行した時に動く処理
 * (テーブルを作る・カラムを追加する)
 * 
 * down() = php artisan migrate:rollbackを実行したときに動く処理
 * (up() でやったことがもとに戻す)
 * 
 */

return new class extends Migration
{
    /**
     * up() メソッド：カラムを追加する
     * 
     * ［Schema::table() とは？］
     * [既存のテーブルを変更する]時に使います。
     * Schema::create()は新しいテーブルを作るときに使う
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // role カラムを追加
            // enum型 = 指定した値しか入れられない特別な型
            // 例 : 'admin' か 'user' しか入れられない
            // -> タイプミスで 'admines' などが入れることを防ぐ
            //
            // ->default('user')
            // = 何も指定しなかったとき自動で　'user'になる
            // -> 新規登録したユーザーは全員 'user'からスタート
            //
            // -> after('email')
            // = email カラムの直後に配置する (見た目の整理)
            $table->enum('role', ['admin', 'user'])
                ->default('user')
                ->after('email');

            /**
             * phone カラムを追加
             * 
             * string型 = 文字列 (最大20文字)
             * 
             * ->nullable()
             *  = NULLを許可する (入力しなくてもOK)
             *  -> 電話番号は任意入力にしたいので nullableにする
             *  -> nullable() を付けないと必須入力になる
             */
            $table->string('phone', 20)
                ->nullable()
                ->after('role');
        });
    }

    /**
     * down() メソッド : 追加したカラムを削除する (ロールバック用)
     * 
     * php artisan migrate:rollbackを実行したときに呼ばれます。
     * up()でやったことを[なかったこと]にする処理を書きます。
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //　dropColumn(['role', 'phone'])
            // 配列で複数まとめて削除できる
            $table->dropColumn(['role', 'phone']);
        });
    }
};
