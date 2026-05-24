<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationCancelled extends Notification
{
    use Queueable;

    protected $reservation;

    /**
     * コンストラクタでキャンセルされた予約情報を受け取る
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
        $date = $this->reservation->reserved_at->format('Y年m月d日 H:i');

        return (new MailMessage)
            ->subject('【重要】予約キャンセル受付のお知らせ')
            ->greeting($notifiable->name . ' 様')
            ->line('以下の予約キャンセルを受け付けました。')
            ->line('---')
            ->line('予約日時:' . $date)
            ->line('---')
            ->line('またのご利用をお待ちしております。')
            ->action('予約一覧を確認する', url(route('reservations.index')))
            ->line('※このメールに心当たりがない場合は、お手数ですが破棄してください。');
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
