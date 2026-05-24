<?php

namespace App\Http\Controllers\Admin;

/**
 * このコントローラの役割：
 *  登録ユーザーの一覧・詳細 (予約履歴) を管理者が確認できます。
 */

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
  /**
   * ユーザー一覧を表示
   * URL: GET /admin/users
   * Reactファイル： resources/js/Pages/Admin/Users/Index.jsx
   */
  public function index(Request $request)
  {
    // 検索ワードの取得
    $search = $request->input('search');

    // ユーザー一覧の取得（roleがuserのものに限定）
    $users = User::where('role', 'user')
      ->when($search, function ($query) use ($search) {
        // 検索ワードがある場合、名前かメールアドレスで絞り込み
        return $query->where(function ($q) use ($search) {
          $q->where('name', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%");
        });
      })
      ->withCount('reservations') // 各ユーザーの予約件数を取得
      ->orderBy('created_at', 'desc') // 新しい順
      ->paginate(20) // 1ページ20件
      ->withQueryString(); // ページをめくっても検索条件を維持

    // React側に渡すデータの整形
    $data = $users->through(fn($u) => [
      'id'                 => $u->id,
      'name'               => $u->name,
      'email'              => $u->email,
      'phone'              => $u->phone,
      'reservations_count' => $u->reservations_count,
      'created_at'         => $u->created_at->format('Y年m月d日'),
    ]);

    // InertiaでReactにデータを渡す
    return Inertia::render('Admin/Users/Index', [
      'users'   => $data,
      'filters' => [
        'search' => $search
      ],
    ]);
  }
}
