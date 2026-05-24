<?php

namespace App\Http\Requests;

/**
 * StoreReservationRequest (予約作成リクエストクラス)
 * 
 * ［FormRequestとは？］
 * フォームから送られてきたデータが「正しいか」を確認する専用のクラスです。
 * コントローラーに届く前に自動でチェックしてくれます。
 * 
 * 【使い方】
 * コントローラーのメソッドの引数に書くだけで自動で動きます。
 * 
 * public function store(StoreReservationRequest $request)
 * ↑これを書くだけでバリデーションが走る
 * 
 * バリデーションに失敗すると、自動でエラーレスポンスを返します。
 */

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    /**
     * このリクエストをだれが使えるか
     * true = ログイン済みユーザー全員が使える
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * バリデーションルール 
     */
    public function rules(): array
    {
        return [
            /**
             * reserved_date (予約日)のルール
             * 
             * 'required'  = 必須入力 (空はNG)
             * 'date'      = 日付形式であること
             * 'after_or_equal:today' = 今日以降の日付であること
             * 
             * reserved_time (予約時刻)のルール
             * 
             * 'date_format:H:i' = H:i 形式であること
             * 
             * notes (備考)のルール
             * 
             * 'nullable' = 空 (null)でもOK
             * 'string'   = 文字列であること
             * 'max:500'  = 500文字以内
             */
            'reserved_date' => ['required', 'date', 'after_or_equal:today', 'before:+3 months'],
            'reserved_time' => ['required', 'date_format:H:i'],
            'notes'         => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * エラーメッセージの日本語化
     */
    public function messages(): array
    {
        return [
            'reserved_date.required'         => '予約日を選択してください',
            'reserved_date.date'             => '正しい日付形式で入力してください',
            'reserved_date.after_or_equal'   => '予約日は本日以降を選択してください',
            'reserved_date.before'           => '3カ月以上先も予約は受け付けておりません',
            'reserved_time.required'         => '予約時間を選択してください',
            'reserved_time.date_format'      => '正しい時刻形式で入力してください',
            'notes.max'                      => '備考は500文字以内で入力してください',
        ];
    }
}
