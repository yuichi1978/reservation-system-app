<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    // 管理者用のダッシュボード
    // URL: GET /admin/dashboard
    // Reactファイル： resources/js/Pages/Admin/Dashboard.jsx

    public function index()
    {
        $today     = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        // 統計データを集計
        $stats = [
            // whereDate() = 日付部分だけを比較する
            // where('reserved_at', '>=', ...) = 今月以降のデータ
            'today_count'     => Reservation::whereDate('reserved_at', $today)->count(),
            'month_count'     => Reservation::where('reserved_at', '>=', $thisMonth)->count(),
            'pending_count'   => Reservation::where('status', 'pending')->count(),
            'confirmed_count' => Reservation::where('status', 'confirmed')->count(),
            'total_users'     => User::where('role', 'user')->count(),
        ];

        // 本日以降の直近10件の予約を取得
        // with('user') = Eager Loading (N+1問題を防ぐ重要な書き方)
        //
        // [N+1問題とは？]
        // 予約を10件取得するとき、各予約のユーザー情報を
        // 1件ずつ取得するとSQLが1+10=11回走ってします問題。
        // with('user')を付けるとSQLが2回で済む (高速化)。
        
        $recentReservations = Reservation::with('user')
        ->where('reserved_at', '>=', $today)
        ->whereIn('status', ['pending', 'confirmed'])
        ->orderBy('reserved_at', 'asc')
        ->take(10)
        ->get()
        ->map(fn($r) => [
            'id'            => $r->id,
            'user_name'     => $r->user->name,
            'user_email'    => $r->user->email,
            'reserved_at'   => $r->reserved_at->format('m月d日 H:i'),
            'status'        => $r->status,
            'status_label'  => $r->status_label,
        ]);

        return Inertia::render('Admin/Dashboard', [
            'stats'              => $stats,
            'recentReservations' => $recentReservations,
        ]);
    }
}
