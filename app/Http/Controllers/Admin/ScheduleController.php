<?php

namespace App\Http\Controllers\Admin;

/**
 * このコントローラーの役割：
 *  週７日分の営業時間・定休日・予約間隔を管理します。
 * 
 * 対応するルート (routes/web.php) :
 *  GET    /admin/schedules              -> index()    営業時間設定ページ
 *  PATCH  /admin/schedules/bulk-update  -> bulkUpdate() 7日分まとめて保存
 */

use App\Models\Schedule;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    /**
     * 営業時間設定ページ
     * URL: GET /admin/schedules
     * Reactファイル: resources/js/Pages/Admin/Schedules/Index.jsx
     */
    public function index()
    {
        $schedules = Schedule::orderBy('day_of_week')->get()->map(fn($schedule) => [
            'id'                    => $schedule->id,
            'day_of_week'           => $schedule->day_of_week,
            'day_name'              => $schedule->day_name,
            'open_time'             => $schedule->open_time ? substr($schedule->open_time, 0, 5) : null,
            'close_time'            => $schedule->close_time ? substr($schedule->close_time, 0, 5) : null,
            'is_holiday'            => $schedule->is_holiday,
            'slot_interval_minutes' => $schedule->slot_interval_minutes,
            'max_slots'             => $schedule->max_slots,
        ]);

        return Inertia::render('Admin/Schedules/Index', [
            'schedules'   => $schedules,
        ]);
    }

    /**
     * 営業時間を一括保存 (7日分まとめて)
     * URL: PATCH /admin/schedules/bulk-update
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'schedules'                           => ['required', 'array', 'size:7'],
            'schedules.*.day_of_week'             => ['required', 'integer', 'between:0,6'],
            'schedules.*.is_holiday'              => ['required', 'boolean'],
            'schedules.*.open_time'               => ['nullable', 'date_format:H:i'],
            'schedules.*.close_time'              => ['nullable', 'date_format:H:i'],
            'schedules.*.slot_interval_minutes'   => ['requires', 'integer', 'in:15,30,60'],
            'schedules.*.max_slots'               => ['required', 'integer', 'min:1', 'max:10'],
        ]);

        foreach ($validated['schedules'] as $data) {
            Schedule::updateOrCreate(

                ['day_of_week' => $data['day_of_week']],
                [
                    'is_holiday'      => $data['is_holiday'],
                    'open_time'       => $data['is_holiday'] ? null : ($data['open_time'] ?? null),
                    'close_time'      => $data['is_holiday'] ? null : ($data['close_time'] ?? null),
                    'slot_interval_minutes'   => $data['slot_interval_minutes'],
                    'max_slots'               => $data['max_slots'],
                ]
            );
        }

        return back()->with('success', '営業時間を保存しました');
    }
}
