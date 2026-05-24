<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationConfirmed extends Notification
{
    use Queueable;

    /**
     * コンストラクタで予約情報を受け取る
     */
    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * メール内容を設定
     */
    public function toMail(object $notifiable): MailMessage
    {
        $date = $this->reservation->reserved_at->format('Y年m月d日');

        return (new MailMessage)
            ->subject('【重要】予約確定のお知らせ')
            ->greeting($notifiable->name . ' 様')
            ->line('先日お申し込みいただいた予約が確定いたしました。')
            ->line('当日はお気をつけてお越しください。')
            ->line('---')
            ->line('予約日時：' . $date)
            ->line('---')
            ->action('予約詳細を確認する', url(route('reservations.show', $this->reservation->id)))
            ->line('※キャンセルの場合は、前日までにお手続きをお願いいたします。')
            ->line('スタッフ一同、お待ちしております。');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
