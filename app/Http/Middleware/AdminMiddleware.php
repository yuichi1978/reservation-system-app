<?php

namespace App\Http\Middleware;

/**
 * AdminMiddleware (管理者専用のミドルウェア)
 * 
 * ［ミドルウェアとは？］
 * リクエストがコントローラーに届く「前」に処理を挟む仕組みです。
 * 
 * イメージ：整備員
 * ブラウザ　→ [AdminMiddleware: 管理者？] -> [ミドルウェア②管理者確認] -> コントローラ
 * 
 * このミドルウェアは「管理者(role=admin)かどうか」を確認する
 * 管理者でなければ403エラー (アクセス禁止)を返します
 */

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // auth()->user() = ログインしているか確認
        // auth()->user()->role = ログイン中のユーザーのroleを取得
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            // 管理者でなければ 403 エラー (アクセス禁止)
            abort(403, '管理者権限が必要です。');
        }

        // 管理者なら次の処理 (コントローラ)へ進む
        return $next($request);
    }
}
