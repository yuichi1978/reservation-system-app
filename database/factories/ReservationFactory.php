<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = now();

        return [
            // 登録されているユーザーの中からランダムに1人選んで、そのIDを入れる
            'user_id' => User::inRandomOrder()->first()->id,

            // 「本日の予約」にするため、現在の日時を入れる
            'reserved_at' => now(),

            // 開始時間の30分後に終了時間に設定する
            'end_at' => $startDate->copy()->addMinutes(30),

            // ステータスを「予約確定」の状態にする
            'status'   => 'confirmed',
        ];
    }
}
