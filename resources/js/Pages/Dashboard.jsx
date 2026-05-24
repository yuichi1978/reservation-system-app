// ============================================================
// ファイルパス: resources/js/Pages/Dashboard.jsx
//
// ▼ 配置場所
//   your-project/resources/js/Pages/Dashboard.jsx
//   既存ファイルをこの内容で上書きしてください
//
// ============================================================
// 医療クリニック × ダークプロ デザイン対応版
// ============================================================

import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

// ステータスの設定（タイポ修正済み）
const STATUS_CONFIG = {
    pending:   { label: "仮予約",   variant: "secondary"   },
    confirmed: { label: "予約確定", variant: "default"     },
    completed: { label: "完了",     variant: "outline"     },
    cancelled: { label: "キャンセル", variant: "destructive" },
};

// アニメーション設定
const containerVariants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

export default function Dashboard({ auth, reservations = [], flash = {} }) {
    const user = auth.user;

    const upcomingReservations = reservations
        .filter((r) => ["pending", "confirmed"].includes(r.status))
        .slice(0, 3);

    return (
        <AuthenticatedLayout user={user}>
            <Head title="ダッシュボード" />

            <div className="space-y-8">

                {/* ===== フラッシュメッセージ ===== */}
                {flash.success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl text-sm border"
                        style={{
                            backgroundColor: "#f0fdf4",
                            borderColor: "#86efac",
                            color: "#166534",
                        }}
                    >
                        {flash.success}
                    </motion.div>
                )}

                {/* ===== ウェルカムセクション ===== */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1"
                >
                    <div>
                        <h1
                            className="text-2xl font-bold tracking-tight"
                            style={{ color: "#1a2e4a" }}
                        >
                            こんにちは、{user.name}さん
                        </h1>
                        <p
                            className="text-sm mt-1"
                            style={{ color: "#607d9a" }}
                        >
                            予約の確認・新規予約はこちらから
                        </p>
                    </div>

                    {/* 新規予約ボタン */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <button
                            onClick={() => window.location.href = route("reservations.create")}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: "#1a6bb5" }}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            新規予約
                        </button>
                    </motion.div>
                </motion.div>

                <Separator style={{ borderColor: "#dde8f2" }} />

                {/* ===== 直近の予約 ===== */}
                <section>
                    <div className="flex items-center justify-between mb-5">
                        <h2
                            className="text-base font-bold"
                            style={{ color: "#1a2e4a" }}
                        >
                            直近の予約
                        </h2>
                        <Link
                            href={route("reservations.index")}
                            className="text-sm font-medium transition-opacity hover:opacity-70"
                            style={{ color: "#1a6bb5" }}
                        >
                            すべて見る →
                        </Link>
                    </div>

                    {upcomingReservations.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* 予約なし（破線ボーダー） */}
                            <div
                                className="rounded-xl p-10 text-center"
                                style={{
                                    border: "2px dashed #cbd8e6",
                                    backgroundColor: "white",
                                }}
                            >
                                {/* カレンダーアイコン */}
                                <div
                                    className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                                    style={{ backgroundColor: "#eef4fb" }}
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                                        stroke="#1a6bb5" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p
                                    className="text-sm font-medium mb-1"
                                    style={{ color: "#607d9a" }}
                                >
                                    予約がありません
                                </p>
                                <p
                                    className="text-xs mb-5"
                                    style={{ color: "#90a4b7" }}
                                >
                                    カレンダーから希望の日時を選んでください
                                </p>
                                <button
                                    onClick={() => window.location.href = route("reservations.create")}
                                    className="text-sm px-4 py-2 rounded-lg border transition-colors hover:opacity-80"
                                    style={{
                                        borderColor: "#1a6bb5",
                                        color: "#1a6bb5",
                                        backgroundColor: "white",
                                    }}
                                >
                                    最初の予約をする
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {upcomingReservations.map((reservation) => (
                                <motion.div key={reservation.id} variants={cardVariants}>
                                    <ReservationCard reservation={reservation} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </section>

                {/* ===== メニューカード ===== */}
                <section>
                    <h2
                        className="text-base font-bold mb-5"
                        style={{ color: "#1a2e4a" }}
                    >
                        メニュー
                    </h2>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid gap-4 sm:grid-cols-2"
                    >
                        {[
                            {
                                href:  route("reservations.create"),
                                title: "新規予約",
                                desc:  "カレンダーから空き時間を選んで予約",
                                icon:  "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                            },
                            {
                                href:  route("reservations.index"),
                                title: "予約一覧",
                                desc:  "過去・未来の予約を確認・キャンセル",
                                icon:  "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                            },
                        ].map((item) => (
                            <motion.div key={item.href} variants={cardVariants}>
                                <Link href={item.href} className="block group">
                                    <div
                                        className="rounded-xl p-4 flex items-center gap-4 transition-all duration-200"
                                        style={{
                                            backgroundColor: "white",
                                            border: "1px solid #dde8f2",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = "#1a6bb5";
                                            e.currentTarget.style.boxShadow = "0 2px 12px rgba(26,107,181,0.10)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = "#dde8f2";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        {/* アイコン */}
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: "#eef4fb" }}
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                                stroke="#1a6bb5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                <path d={item.icon} />
                                            </svg>
                                        </div>
                                        {/* テキスト */}
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="text-sm font-bold mb-0.5"
                                                style={{ color: "#1a2e4a" }}
                                            >
                                                {item.title}
                                            </p>
                                            <p
                                                className="text-xs"
                                                style={{ color: "#90a4b7" }}
                                            >
                                                {item.desc}
                                            </p>
                                        </div>
                                        {/* 矢印 */}
                                        <svg className="w-4 h-4 shrink-0"
                                            style={{ color: "#cbd8e6" }}
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

            </div>
        </AuthenticatedLayout>
    );
}

// ============================================================
// 予約カードコンポーネント
// ============================================================
function ReservationCard({ reservation }) {
    const config = STATUS_CONFIG[reservation.status] ?? STATUS_CONFIG.pending;

    return (
        <div
            className="rounded-xl p-4 h-full transition-shadow hover:shadow-md"
            style={{
                backgroundColor: "white",
                border: "1px solid #dde8f2",
            }}
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <p
                    className="text-sm font-bold leading-snug"
                    style={{ color: "#1a2e4a" }}
                >
                    {reservation.reserved_at}
                </p>
                <Badge variant={config.variant} className="shrink-0 text-xs">
                    {config.label}
                </Badge>
            </div>
            <p
                className="text-xs mb-2"
                style={{ color: "#90a4b7" }}
            >
                〜 {reservation.end_at} まで
            </p>
            {reservation.notes && (
                <p
                    className="text-xs line-clamp-2 leading-relaxed"
                    style={{ color: "#607d9a" }}
                >
                    {reservation.notes}
                </p>
            )}
        </div>
    );
}
