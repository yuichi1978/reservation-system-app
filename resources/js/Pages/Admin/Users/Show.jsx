import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    PageCard,
    CardBody,
    StatusBadge,
    EmptyState,
    ListRow,
    CLINIC_COLORS,
} from "@/Components/UI";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

/**
 * 詳細情報の1行コンポーネント
 */
function DetailRow({ label, value }) {
    return (
        <div
            className="flex items-center justify-between py-4 border-b last:border-0"
            style={{ borderColor: CLINIC_COLORS.divider }}
        >
            <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{
                    color: CLINIC_COLORS.textSub,
                    letterSpacing: "0.06em",
                }}
            >
                {label}
            </span>
            <span
                className="text-sm font-medium"
                style={{ color: CLINIC_COLORS.textPrimary }}
            >
                {value}
            </span>
        </div>
    );
}

export default function Show({ auth, user, reservations = [] }) {
    // 安全なイニシャル取得
    const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`${user?.name || "ユーザー"} - 詳細`} />

            {/* ヒーローバナー */}
            <div
                className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-8 px-4 sm:px-6 lg:px-8 py-8"
                style={{ backgroundColor: CLINIC_COLORS.navy }}
            >
                <div className="max-w-3xl mx-auto flex items-center gap-5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-lg"
                        style={{
                            backgroundColor: CLINIC_COLORS.blue,
                            border: "3px solid rgba(255, 255, 255, 0.15)",
                        }}
                    >
                        {initial}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-1.5"
                            style={{
                                backgroundColor: "#1e2d45",
                                color: "#8ba8c8",
                            }}
                        >
                            ユーザー管理
                        </span>
                        <h1 className="text-xl font-bold text-white">
                            {user?.name}
                        </h1>
                        <p
                            className="text-sm mt-0.5"
                            style={{ color: "#8ba8c8" }}
                        >
                            {user?.email}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto py-8 space-y-6">
                {/* 戻るリンク */}
                <Link
                    href={route("admin.users.index")}
                    className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
                    style={{ color: CLINIC_COLORS.blue }}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    一覧に戻る
                </Link>

                {/* 基本情報 */}
                <PageCard title="基本情報">
                    <CardBody className="py-0">
                        <DetailRow label="氏名" value={user?.name} />
                        <DetailRow label="メール" value={user?.email} />
                        <DetailRow
                            label="電話番号"
                            value={user?.phone || "未登録"}
                        />
                        <DetailRow label="登録日" value={user?.created_at} />
                        <DetailRow
                            label="通算予約"
                            value={`${reservations.length} 件`}
                        />
                    </CardBody>
                </PageCard>

                {/* 予約履歴 */}
                <PageCard title="予約履歴">
                    <CardBody className="space-y-3">
                        {reservations.length === 0 ? (
                            <EmptyState message="まだ予約履歴がありません" />
                        ) : (
                            reservations.map((reservation, index) => (
                                <ListRow key={reservation.id} index={index}>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-800">
                                            {reservation.reserved_at}
                                        </span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-tighter">
                                            Reserved Date
                                        </span>
                                    </div>
                                    <StatusBadge status={reservation.status} />
                                </ListRow>
                            ))
                        )}
                    </CardBody>
                </PageCard>
            </div>
        </AuthenticatedLayout>
    );
}
