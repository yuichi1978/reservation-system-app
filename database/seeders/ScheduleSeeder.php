<?php

namespace Database\Seeders;

use App\Models\Schedule;
use Illuminate\Database\Seeder;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        /**
         * 週7日分の営業設定を定義する
         * 
         * 配列のキー = day_of_week (0=日曜 ~ 6=土曜)
         */
        $schedules = [
            // 0 = 日曜日 (定休日)
            0 => [
                'open_time'             => null,  // 定休日なのでnull
                'close_time'            => null, // 定休日なのでnull
                'is_holiday'            => true, // 定休日フラグON
                'slot_interval_minutes' => 30,
                'max_slots'             => 1,
            ],
            // 1 = 月曜日 (通常営業)
            1 => [
                'open_time'             => '10:00:00',
                'close_time'            => '18:00:00',
                'is_holiday'            => false,
                'slot_interval_minutes' => 30,
                'max_slots'             => 1,
            ],
            // 2 = 火曜日
            2 => [
                'open_time'             => '10:00:00',
                'close_time'            => '18:00:00',
                'is_holiday'            => false,
                'slot_interval_minutes' => 30,
                'max_slots'             => 1,
            ],
            // 3 = 水曜日
            3 => [
                'open_time'             => '10:00:00',
                'close_time'            => '18:00:00',
                'is_holiday'            => false,
                'slot_interval_minutes' => 30,
                'max_slots'             => 1,
            ],
            // 4 = 木曜日
            4 => [
                'open_time'             => '10:00:00',
                'close_time'            => '18:00:00',
                'is_holiday'            => false,
                'slot_interval_minutes' => 30,
                'max_slots'             => 1,
            ],
            // 5 = 金曜日
            5 => [
                'open_time'             => '10:00:00',
                'close_time'            => '18:00:00',
                'is_holiday'            => false,
                'slot_interval_minutes' => 30,
                'max_slots'             => 1,
            ],
            // 6 = 土曜日 (短縮営業)
            6 => [
                'open_time'             => '10:00:00',
                'close_time'            => '16:00:00', // 土曜日は16時まで
                'is_holiday'            => false,
                'slot_interval_minutes' => 30,
                'max_slots'             => 1,
            ],
        ];
        // 7日分をループして保存
        foreach ($schedules as $dayOfWeek => $data) {
            Schedule::updateOrCreate(
                ['day_of_week' => $dayOfWeek], // この曜日番号で検索
                $data                          // 見つからないければ作成、あれば更新
            );
        }

        $this->command->info('✅ 週7日分の営業時間を設定しました');
        $this->command->info('月～金： 10:00～18:00 (30分間隔)');
        $this->command->info('土曜: 10:00～16:00 (30分間隔)');
        $this->command->info('日曜: 定休日');
    }
}
