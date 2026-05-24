<?php

namespace App\Models;

/**
 * Modelとは？
 * 
 * データベースの1つのテーブルに対応するPHPクラスです。
 * 
 * 例：
 * User モデル　　-> users テーブル
 * Reservation モデル -> reservations テーブル
 * Schedule モデル   -> schedules テーブル
 * 
 * モデルを使うと SQL を直接書かずにデータを操作できます：
 * 
 * SQL:SELECT * FROM users WHERE id = 1
 * $user = User::find(1);
 * 
 * SQL：UPDATE users SET name = '山田' WHERE id = 1
 * $user->update(['name' => '山田']);
 * 
 */

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * $fillable (一括代入を許可するカラム)
     * 
     * [なせ必要？]
     * セキュリティのため、フォームから受け取ったデータを
     * そのままDBに保存することを laravelは制限しています。
     * ここに書いたカラムだけが保存できます。
     * 
     * roleとphoneを追加しました(Breezeの初期値から変更)
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
    ];

    /**
     * $hidden (APIレスポンスに含めないカラム)
     * 
     * JSON で返すとき password が濡れないように隠す
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * casts (型変換の設定)
     * 
     * DBから取得したとき、自動で型変換してくれる設定です。
     * 
     * 'password' => 'hashed
     * -> パスワードを保存するときに自動でハッシュかしてくれる
     * -> bcrypt()を手動で呼ぶ必要がなくなる
     */

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * アクセサ (不便なゲッター)
     * 
     * $user->is_admin のように、まるでカラムのように使えます。
     * 
     * 使い方
     * if ($user->is_admin) {
     *   // 管理者向けの処理
     * }
     * 
     */
    public function getIsAdminAttribute(): bool
    {
        return $this->role === "admin";
    }

    /**
     * リレーション (テーブル間の関連)
     * 
     * 【hasMany = 「1対多」の関係】
     * 1人のユーザーは複雑の予約を持つ
     *  -> User HasMany Reservation
     * 
     * 使い方：
     * $user->reservations -> そのユーザーの全予約
     * $user->reservations()->count() -> 予約件数
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
