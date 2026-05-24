import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ============================================================
// ログインページ
//
// 【framer-motion アニメーション解説】
//   motion.div    = アニメーションできる div タグ
//   initial       = 表示される前の「最初の状態」
//   animate       = 表示された後の「最終の状態」
//   transition    = アニメーションのスピード・動き方
//
// 【このページのアニメーション設計】
//   1. カード全体  : 下(y:40)から上(y:0)にフワッと浮き上がる
//   2. ロゴエリア  : 少し遅れて(delay:0.1)フェードイン
//   3. 各入力欄   : さらに遅れて左からスライドイン
//   4. ボタン      : ホバーで少し拡大、クリックで少し縮小
// ============================================================

export default function Login({ status, canResetPassword }) {
    // -------------------------------------------------------
    // useForm: Inertia.js が提供するフォーム管理の仕組み
    //   data       = フォームの入力値
    //   setData    = 入力値を更新する関数
    //   post       = サーバーに POST 送信する関数
    //   processing = 送信中は true になる（ボタンを無効化するために使う）
    //   errors     = サーバーから返ってきたバリデーションエラー
    //   reset      = 指定したフィールドを空にリセットする関数
    // -------------------------------------------------------
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault(); // ブラウザのデフォルト送信をキャンセル
        post(route("login"), {
            onFinish: () => reset("password"), // 送信完了後にパスワードをクリア
        });
    };

    return (
        <>
            {/* ブラウザのタブに表示されるタイトル */}
            <Head title="ログイン" />

            {/* 画面全体：中央揃え + 背景グラデーション */}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
                {/* ===== アニメーション①：カード全体が下から上に浮き上がる ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-sm md:max-w-md"
                >
                    {/* ===== アニメーション②：ロゴエリアが少し遅れてフェードイン ===== */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="text-center mb-8"
                    >
                        {/* カレンダーアイコン */}
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
                            <svg
                                className="w-8 h-8 text-primary-foreground"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            予約管理システム
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            アカウントにログインしてください
                        </p>
                    </motion.div>

                    {/* ===== ログインカード ===== */}
                    <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-xl">ログイン</CardTitle>
                            <CardDescription>
                                メールアドレスとパスワードを入力してください
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {/* パスワードリセット後などにサーバーから届くメッセージ */}
                            {status && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm"
                                >
                                    {status}
                                </motion.div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                {/* ===== アニメーション③：メールアドレス欄が左からスライドイン ===== */}
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.3 }}
                                    className="space-y-2"
                                >
                                    {/* Label = shadcn/ui のラベルコンポーネント */}
                                    <Label htmlFor="email">
                                        メールアドレス
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="example@email.com"
                                        className={
                                            errors.email
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : ""
                                        }
                                    />
                                    {/* エラーがあれば赤文字で表示 */}
                                    {errors.email && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-sm text-red-500"
                                        >
                                            {errors.email}
                                        </motion.p>
                                    )}
                                </motion.div>

                                {/* ===== パスワード欄（0.3秒遅れでスライドイン） ===== */}
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3, duration: 0.3 }}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">
                                            パスワード
                                        </Label>
                                        {/* パスワードリセット機能が有効なときだけリンクを表示 */}
                                        {canResetPassword && (
                                            <Link
                                                href={route("password.request")}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                パスワードを忘れた方
                                            </Link>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="パスワードを入力"
                                        className={
                                            errors.password
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : ""
                                        }
                                    />
                                    {errors.password && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-sm text-red-500"
                                        >
                                            {errors.password}
                                        </motion.p>
                                    )}
                                </motion.div>

                                {/* ===== アニメーション④：ボタンがホバーで拡大・クリックで縮小 ===== */}
                                {/* whileHover / whileTap は motion.div に直接書ける便利な書き方 */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.3 }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {/* 送信中はスピナーアイコンに切り替え */}
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <svg
                                                    className="animate-spin h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                    />
                                                </svg>
                                                ログイン中...
                                            </span>
                                        ) : (
                                            "ログイン"
                                        )}
                                    </Button>
                                </motion.div>
                            </form>
                        </CardContent>

                        {/* カードのフッター：新規登録へのリンク */}
                        <CardFooter className="flex flex-col gap-3 pt-0">
                            <Separator />
                            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                                アカウントをお持ちでない方は{" "}
                                <Link
                                    href={route("register")}
                                    className="text-primary font-medium hover:underline"
                                >
                                    新規登録
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </>
    );
}
