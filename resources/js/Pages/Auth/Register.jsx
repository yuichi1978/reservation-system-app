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

/**
 * framer-motion の応用： staggerChildren (時間差アニメーション)
 *
 * ログインページでは各フィールドでdelay: 0.2，0.3, 0.4と手動で時間差を設定しました
 *
 * 新規登録ページではフィールドが多いので
 * 「variant」の仕組みを使っています。
 * 親要素がまとめて子要素を時間差で表示
 *
 */

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08, // 子要素を0.08ずつ遅らせる
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: "easeOut" },
    },
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "passowrd_confirmation"),
        });
    };

    return (
        <>
            <Head title="新規登録" />

            {/* 画面全体：中央揃え + 背景グラデーション (縦に長いのでスクロール対応で py-12) */}
            <div
                className="
                    min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50
                  to-slate-100 dark:from-slate-900 dark:to-slate-800 p-2 py-3"
            >
                {/* カード全体のフェードイン */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-sm md:max-w-md"
                >
                    {/* ロゴエリア (scale アニメーション：少し大きい状態から通常サイズへ縮む) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="text-center mb-8"
                    >
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
                            アカウント作成
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            必要事項を入力して登録してください
                        </p>
                    </motion.div>

                    {/* 登録カード */}
                    <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl">新規登録</CardTitle>
                            <CardDescription>
                                登録後すぐにご予約いただけます
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {/*
                             * motion.formにvariantsを設定
                             * initial="hidden" -> animate="visible" に変わるとき
                             * 子要素 (motion.div)が順番に現れる
                             */}
                            <motion.form
                                onSubmit={submit}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                {/* お名前 (最初に表示) */}
                                <motion.div
                                    variants={itemVariants}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="name">お名前</Label>
                                    <Input
                                        id="name"
                                        type="name"
                                        autoComplete="name"
                                        autoFocus
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="山田 太郎"
                                        className={
                                            errors.name ? "border-red-500" : ""
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </motion.div>

                                {/* メールアドレス (0.08秒後に表示) */}
                                <motion.div
                                    variants={itemVariants}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="email">
                                        メールアドレス
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        autoComplete="username"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="example@email.com"
                                        className={
                                            errors.email ? "border-red-500" : ""
                                        }
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </motion.div>

                                {/* 電話番号 (任意　0.16秒後に表示) */}
                                <motion.div
                                    variants={itemVariants}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="phone">
                                        電話番号
                                        <span className="ml-2 text-xs text-slate-400">
                                            (任意)
                                        </span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        placeholder="000-0000-0000"
                                    />
                                </motion.div>

                                {/* パスワード (0.24秒後) */}
                                <motion.div
                                    variants={itemVariants}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="password">パスワード</Label>
                                    <Input
                                        id="password"
                                        value={data.password}
                                        autoComplete="new-password"
                                        type="password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="8文字以上"
                                        className={
                                            errors.password
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-500">
                                            {errors.password}
                                        </p>
                                    )}
                                </motion.div>

                                {/* 確認用パスワード (0.32秒後) */}
                                <motion.div
                                    variants={itemVariants}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="password_confirmation">
                                        パスワード (確認)
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="もう一度入力してください"
                                    />
                                </motion.div>

                                {/* 登録ボタン (最後に表示) */}
                                <motion.div
                                    variants={itemVariants}
                                    whileInView={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <Button
                                        type="submit"
                                        className="w-full p-5"
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
                                                登録中...
                                            </span>
                                        ) : (
                                            "アカウントを作成する"
                                        )}
                                    </Button>
                                </motion.div>
                            </motion.form>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-3 pt-0">
                            <Separator />
                            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                                既にアカウントをお持ちの方は
                                <Link
                                    href={route("login")}
                                    className="ml-2 text-primary font-medium hover:underline"
                                >
                                    ログイン
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </>
    );
}
