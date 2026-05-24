<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Scheduleモデル (営業時間管理)
 * 
 * 曜日ごとの営業設定を管理します。
 * 管理者が設定し、予約作成時に利用可能な時間帯を判断するために使います。
 */

class Schedule extends Model
{
    protected $fillable = [
      'day_of_week',
      'open_time',
      'close_time',
      'is_holiday',
      'slot_interval_minutes',
      'max_slots',
    ];

    /**
     * 型変換の定義
     */
    protected $casts = [
      'is_holiday' => 'boolean',
      'day_of_week' => 'integer',
      'slot_interval_minutes' => 'integer',
      'max_slots' => 'integer',
    ];

    // ======== 便利メソッド ========

    /**
     * 曜日番号を日本語名に変換
     * 
     * 使い方: $schedule->day_name -> "月曜日"
     */
    public function getDayNameAttribute(): string
    {
      $days = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
      return $days[$this->day_of_week] ?? '不明';
    }

    /**
     * その日に予約可能な時間帯の一覧を生成
     * 
     * 例： 10:00~12:00、 30分間隔 -> ["10:00", "10:30", "11:00"]
     * 
     * @return array 予約可能な時間帯の配列
     */
    public function getAvailableSlots(): array
    {
      // 定休日は空の配列を返す
      if ($this->is_holiday || !$this->open_time || !$this->close_time) {
        return [];
      }

      $slots = [];
      $current = strtotime($this->open_time);
      $close = strtotime($this->close_time);
      $interval = $this->slot_interval_minutes * 60; // 分->秒に変換

      // 開始時間から終了時間まで、間隔ごとに時間帯を生成
      while ($current < $close) {
        $slots[] = date('H:i', $current);
        $current += $interval;
      }

      return $slots;
    }
}
