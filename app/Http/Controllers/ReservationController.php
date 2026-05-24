<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Routing\Controller as BaseController;

class ReservationController extends BaseController
{
    public function index()
    {
        $reservations = Reservation::with('user')
            ->where('user_id', Auth::id())
            ->where('status', '!=', 'cancelled')
            ->orderBy('reserved_at', 'desc')
            ->paginate(10)
            ->through(function ($r) {
                return [
                    'id'             => $r->id,
                    'reserved_at'    => $r->reserved_at->format('Y年m月d日 H:i'),
                    'end_at'         => $r->end_at->format('H:i'),
                    'status'         => $r->status,
                    'status_label'   => $r->status_label,
                    'notes'          => $r->notes,
                    'is_cancellable' => $r->isCancellable(),
                    'user_name'      => $r->user ? $r->user->name : 'ゲスト',
                ];
            });

        return Inertia::render('Reservations/Index', [
            'reservations' => $reservations,
        ]);
    }

    public function create()
    {
        $schedules = Schedule::all()->map(function ($s) {
            return [
                'day_of_week'     => $s->day_of_week,
                'day_name'        => $s->day_name,
                'open_time'       => $s->open_time,
                'close_time'      => $s->close_time,
                'is_holiday'      => $s->is_holiday,
                'slot_interval_minutes' => $s->slot_interval_minutes,
                'available_slots'       => $s->getAvailableSlots(),
            ];
        });

        return Inertia::render("Reservations/Create", [
            'schedules' => $schedules,
        ]);
    }

    public function store(Request $request)
    {
        $reservedAt = Carbon::parse($request->reserved_date . ' ' . $request->reserved_time);
        $dayOfWeek = $reservedAt->dayOfWeek;
        $schedule = \App\Models\Schedule::query()->where('day_of_week', $dayOfWeek)->first();
        $interval = $schedule ? $schedule->slot_interval_minutes : 30;
        $endAt    = $reservedAt->copy()->addMinutes($interval);

        Reservation::create([
            'user_id'     => Auth::id(),
            'reserved_at' => $reservedAt,
            'end_at'      => $endAt,
            'status'      => 'pending',
            'notes'       => $request->notes,
        ]);

        return redirect()->route('reservations.index')->with('success', '予約を受け付けました。');
    }

    public function show(Reservation $reservation)
    {
        if ($reservation->user_id !== Auth::id()) { abort(403); }
        return Inertia::render('Reservations/Show', [
            'reservation' => [
                'id'           => $reservation->id,
                'reserved_at'  => $reservation->reserved_at->format('Y年m月d日 H:i'),
                'end_at'       => $reservation->end_at->format('H:i'),
                'status'       => $reservation->status,
                'status_label' => $reservation->status_label,
                'notes'        => $reservation->notes,
                'is_cancellable' => $reservation->isCancellable(),
            ],
        ]);
    }

    public function destroy(Reservation $reservation)
    {
        if ($reservation->user_id !== Auth::id()) { abort(403); }
        $reservation->update(['status' => 'cancelled']);
        return redirect()->route('reservations.index')->with('success', '予約をキャンセルしました');
    }
}
