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
import { span } from "framer-motion/client";

/*
 * ［画面の流れ］
 *  1 このページでメールアドレスを入力して送信
 *  2 Laraveがリセット用のURLをメールで送信
 *  3 メール内のリンクを踏むとResetPasswordページへ
 *  4 新しいパスワードを入力して変更完了
 *
 *  [アニメーション設計]
 *  ログインページと同じく「カード」全体が下から上に浮き上がる
 *  シンプルなアニメーション
 *  入力欄が1つだけなのでstaggerChildrenは使いません。
 */

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <>
            <Head title="パスワードリセット" />

            <div
                className="
                    min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50
                  to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4"
            >
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    {/* ロゴエリア */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="text-center mb-8"
                    >
                        {/* 鍵アイコン (パスワードリセットらしいアイコン) */}
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
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            予約管理システム
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            パスワードをリセット
                        </p>
                    </motion.div>

                    {/* リセット申請カード */}
                    <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl">
                                パスワードリセット
                            </CardTitle>
                            <CardDescription>
                                登録済のメールアドレスを入力してください。
                                パスワード再設定用のリンクを送ります。
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {/*
                             *  status = メール送信成功時にサーバーから届くメッセージ
                             *  例：「パスワードリセット用のリンクを送信しました」
                             */}
                            {status && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-greeb-700 dark:text-green-400 text-sm"
                                >
                                    {status}
                                </motion.div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                {/* メールアドレス入力 */}
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.3 }}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="email">
                                        メールアドレス
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="username"
                                        autoFocus
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="登録済みのメールアドレス"
                                        className={
                                            errors.email
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : ""
                                        }
                                    />
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

                                {/* 送信ボタン */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.3 }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
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
                                                送信中...
                                            </span>
                                        ) : (
                                            "リセットリンクを送信"
                                        )}
                                    </Button>
                                </motion.div>

                                <CardFooter className="flex flex-col gap-3 pt-0">
                                    <Separator />
                                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                                        <Link
                                            href={route("login")}
                                            className="text-primary font-medium hover:underline"
                                        >
                                            ログインページへ戻る
                                        </Link>
                                    </p>
                                </CardFooter>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </>
    );
}
