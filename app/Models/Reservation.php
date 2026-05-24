<?php

namespace App\Models;

/**
 * コマンドで骨組みを生成してから上書き
 * php artisan make:model Reservation
 */

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reservation extends Model
{
    /**
     * use SoftDeletes
     * 
     * MigrationでsoftDeletes() を追加したので
     * モデルでも softDeletes をuseする必要があります。
     * 
     * これを書くと:
     *  $reservation->delete() -> 物理削除ではなく deleted_atに日時が入る
     *  Reservation::all()        deleted_at が NULL のものだけ取得
     *  Reservation::withTrashed() -> 削除済みも含めて取得できる
     */

    use SoftDeletes, HasFactory;

    protected $fillable = [
        'user_id',
        'reserved_at',
        'end_at',
        'status',
        'notes',
        'admin_notes',
    ];

    /**
     * casts (型変換)
     * 
     * reserved_at と end_at を "datetime" にキャストすると
     * 取得時に自動で Carbon オブジェクトになります。
     * 
     * [Carbonとは？]
     * Laravelに組み込まれている日時操作クラスです。
     * 
     * キャスト後の使い方:
     *  $reservation->reserved_at->format('Y年m月d日') -> "2024年6月15日"
     *  $reservation->reserved_at->addMinutes(30)     ->  30分後のCarbonオブジェクト
     *  $reservation->reserved_at->isFuture           ->  未来かどうかをboolで返す
     */

    protected $casts = [
        'reserved_at' => 'datetime',
        'end_at'      => 'datetime',
    ];

    /**
     * リレーション (テーブル間の関連)
     * 
     * 【belongsTo = 「多対1」の関係】
     *  1つの予約は1人のユーザーに属する
     *  -> Reservation belongsTo User
     * 
     *  使い方
     *  $reservation->user    -> 予約したUserオブジェクト
     *  $reservation->user->name -> 予約したユーザーの名前
     */

    public function user() 
    {
        return $this->belongsTo(User::class);
    }

    /**
     * スコープ (よく使うクエリを名前付きで定義)
     * 
     * 【スコープとは？】
     *  よく使うクエリの絞り込み条件をメソッドとして定義できます。
     *  
     * 【使い方】
     *  Reservation::confirmed()->get()
     *  -> WHERE status = 'confirmed' で取得
     * 
     *  Reservation::forDate('2024-06-15')->get()
     *  -> WHERE DATE(reserved_at) = '2024-06-15' で取得
     */
    public function scopeConfirmed(Builder $query): Builder
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeForDate(Builder $query, string $date): Builder
    {
        return $query->whereDate('reserved_at', $date);
    }

    /**
     * アクセス：status を日本語ラベルに変換
     * 
     * 使い方: $reservation->status_label -> "予約確定"
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending'   => '受付中',
            'confirmed' => '予約確定',
            'completed' => '完了',
            'cancelled' => 'キャンセル済み',
        };
    }

    /**
     * キャンセル可能かどうかを判定するメソッド
     * 
     * pending (仮契約)かconfirmed (確定) の場合のみキャンセル
     * completed (完了) やcancelled (済み) はキャンセル不可
     */
    public function isCancellable(): bool
    {
        return in_array($this->status, ['pending', 'confirmed']);
    }
}
