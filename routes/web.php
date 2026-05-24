<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ReservationController as AdminReservationController;
use App\Http\Controllers\Admin\ScheduleController as AdminSchedulesController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**
 * ファイルパス: route/web.php
 * 
 * [use文について]
 * use文 = 「このクラスを使います」という宣言です。
 * use文がないと 「Class not found」 エラーになります。
 * ファイルの一番上にまとめて書きます。
 */

/**
 * トップページ　-> ログインページへリダイレクト
 */
Route::get('/', function () {
    return redirect()->route('login');
});

/**
 * ログインが必要なページ (auth ミドルウェア)
 * 
 * middleware('auth') = ログインしていないとログインページに飛ばされる
 * Breezeが自動で設定してくれる仕組みです。dashboard
 */
Route::middleware(['auth'])->group(function () {

    /**
     * ダッシュボード
     * URL: /dashboard
     * Reactファイル： resources/js/Pages/Dashboard.jsx
     */
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    /**
     * プロフィール
     * URL: GET  /profile -> Edit.jsx を表示
     * URL: PATH /profile -> 更新処理
     */
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });

    /**
     * 予約管理 (一般ユーザー)
     * 
     * Route::resource() = 1行でCRUDのルートをまとめて定義
     * only([...]) = 使うルートだけに絞る
     * 
     * 生成されるルート：
     * GET  /reservations         reservations.index   -> Index.jsx
     * GET  /reservations/create  reservations.create  -> Create.jsx
     * POST /reservations         reservations.store   -> store()
     * GET  /reservations/{id}    reservations.show    -> Show.jsx
     * DELETE /reservations/{id}  reservations.delete  -> destroy()
     */
    Route::resource('reservations', ReservationController::class)
        ->only(['index', 'create', 'store', 'show', 'destroy']);

    /**
     * 管理者用ページ
     * 
     * middleware('admin') = AdminMiddlewareを通す
     * prefix('admin')     = すべてのURLが /admin/~になる
     * name('admin.')      = すべてのルート名が admin.～になる
     */
    Route::middleware(['admin'])
        ->prefix('admin')
        ->name('admin.')
        ->group(function () {
            /**
             * 管理ダッシュボード
             * URL: /admin/dashboard
             * Reactファイル: resources/js/Pages/Admin/Dashboard.jsx
             */
            Route::get('/dashboard', [AdminDashboardController::class, 'index'])
                ->name('dashboard');

            /**
             * 予約管理 (管理者)
             * URL: GET    /admin/reservations       -> Admin/Reservations/Index.jsx
             * URL: PATCH  /admin/reservations/{id}  -> ステータス更新
             */
            Route::get('/reservations', [AdminReservationController::class, 'index'])
                ->name('reservations.index');
            Route::patch('/reservations/{reservation}', [AdminReservationController::class, 'update'])
                ->name('reservations.update');

            /**
             * 営業時間設定
             * URL: GET    /admin/schedules              -> Admin/Schedules/Index.jsx
             * URL: PATCH  /admin/schedules/bulk-update  -> 7日分まとめて保存
             */
            Route::get('/schedules', [AdminSchedulesController::class, 'index'])
                ->name('schedules.index');
            Route::patch('schedules/bulk-update', [AdminSchedulesController::class, 'bulkUpdate'])
                ->name('schedules.bulk-update');

            /**
             * ユーザー管理
             * URL: GET /admin/users        -> Admin/Users/Index.jsx
             * URL: GET /admin/users/{id}   -> Admin/Users/Show.jsx
             */
            Route::get('/users', [AdminUserController::class, 'index'])
                ->name('users.index');
            Route::get('/users/{user}', [AdminUserController::class, 'show'])
                ->name('users.show');
        });
});

require __DIR__ . '/auth.php';
