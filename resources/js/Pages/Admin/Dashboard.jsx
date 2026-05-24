import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { CLINIC_COLORS, STATUS_CONFIG } from "@/Components/UI"; // 共通設定をインポート

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.4 },
    }),
};

export default function Dashboard({ auth, stats, recentReservations = [] }) {
    const statCards = [
        {
            label: "本日の予約",
            value: stats.today_count,
            accent: CLINIC_COLORS.blue,
        },
        { label: "今月の予約", value: stats.month_count, accent: "#059669" },
        {
            label: "仮予約（未確定）",
            value: stats.pending_count,
            accent: "#f59e0b",
        },
        { label: "登録ユーザー", value: stats.total_users, accent: "#7c3aed" },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="管理ダッシュボード" />

            <div className="space-y-8">
                {/* ページタイトル */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#0d2e23] text-[#34d399]">
                            管理者
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        管理ダッシュボード
                    </h1>
                    <p className="text-sm mt-1 text-slate-500">
                        予約状況の概要を確認できます
                    </p>
                </motion.div>

                {/* 統計カード */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className="bg-white rounded-xl p-5 border border-slate-200">
                                <p className="text-xs font-medium mb-2 text-slate-400">
                                    {card.label}
                                </p>
                                <p
                                    className="text-3xl font-bold"
                                    style={{ color: card.accent }}
                                >
                                    {card.value}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <Separator className="bg-slate-200" />

                {/* 直近の予約 */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                >
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-bold text-slate-900">
                            本日以降の予約
                        </h2>
                        <Link
                            href={route("admin.reservations.index")}
                            className="text-sm font-medium text-blue-600 hover:opacity-70"
                        >
                            すべて見る →
                        </Link>
                    </div>

                    {recentReservations.length === 0 ? (
                        <div className="bg-white rounded-xl p-10 text-center border-2 border-dashed border-slate-200">
                            <p className="text-sm text-slate-400">
                                本日以降の予約はありません
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentReservations.map((r, i) => (
                                <motion.div
                                    key={r.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.35 + i * 0.05 }}
                                >
                                    <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-slate-200 hover:shadow-sm transition-shadow">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {r.user_name}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {r.user_email}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-slate-500">
                                                {r.reserved_at}
                                            </span>
                                            {/* 補完箇所：ステータスバッジ */}
                                            <span
                                                className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        STATUS_CONFIG[r.status]
                                                            ?.bg || "#f3f4f6",
                                                    color:
                                                        STATUS_CONFIG[r.status]
                                                            ?.color ||
                                                        "#6b7280",
                                                }}
                                            >
                                                {STATUS_CONFIG[r.status]
                                                    ?.label || r.status}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.section>
            </div>
        </AuthenticatedLayout>
    );
}
