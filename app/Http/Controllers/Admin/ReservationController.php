<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Notifications\ReservationConfirmed;
use App\Notifications\ReservationCancelled;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ReservationController extends Controller
{
    /**
     * 予約一覧表示
     */
    public function index(Request $request)
    {
        $status  = $request->input('status');
        $date    = $request->input('date');
        $keyword = $request->input('keyword');

        $reservations = Reservation::with('user')
            // キャンセルされた予約を一覧から除外したい場合は、下の行のコメントを外してください
            // ->where('status', '!=', 'cancelled')
            ->where('status', '!=', 'cancelled')
            ->when($status, fn($q) => $q->where('status', $status))
            ->when($date, fn($q) => $q->whereDate('reserved_at', $date))
            ->when($keyword, fn($q) => $q->whereHas(
                'user',
                fn($u) =>
                $u->where('name', 'like', "%{$keyword}%")
                    ->orWhere('email', 'like', "%{$keyword}%")
            ))
            ->orderBy('reserved_at', 'desc') // 新しい順に並べる
            ->paginate(20);

        $data = $reservations->through(fn($r) => [
            'id'           => $r->id,
            'user_name'    => $r->user?->name ?? '不明',
            'user_email'   => $r->user?->email ?? '-',
            'reserved_at'  => $r->reserved_at->format('Y年m月d日 H:i'),
            'end_at'       => $r->end_at->format('H:i'),
            'status'       => $r->status,
            'status_label' => $r->status_label,
            'notes'        => $r->notes,
        ]);

        return Inertia::render('Admin/Reservations/Index', [
            'reservations' => $data,
            'filters'      => compact('status', 'date', 'keyword'),
        ]);
    }

    /**
     * ステータス更新処理
     */
    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'status'      => ['required', 'in:pending,confirmed,cancelled,completed'],
            'admin_notes' => ['nullable', 'string', 'max:500'],
        ]);

        $oldStatus = $reservation->status;
        
        // 1. データベースの更新を先に実行（これで確実にステータスは変わります）
        $reservation->update($validated);

        // 2. メール通知（設定ミスで止まらないよう try-catch を使用）
        try {
            if ($oldStatus !== $validated['status'] && $validated['status'] === 'confirmed') {
                $reservation->user->notify(new ReservationConfirmed($reservation));
            }

            if ($validated['status'] === 'cancelled') {
                $reservation->user->notify(new ReservationCancelled($reservation, 'admin'));
            }
        } catch (\Exception $e) {
            // メール送信に失敗してもログに記録するだけで、画面は正常に終了させる
            Log::error('通知メールの送信に失敗しました: ' . $e->getMessage());
        }

        // 3. 最後に必ず元のページに戻す（Inertiaで必須）
        return redirect()->back()->with('success', '予約状態を更新しました');
    }
}
