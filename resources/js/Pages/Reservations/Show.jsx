import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { CLINIC_COLORS } from "@/Components/UI";

/**
 * 対応URL： /reservations/{id}
 * 対応コントローラー： ReservationController@show
 */

/**
 * ステータスの設定 (表示ラベル・色・説明文)
 */
const STATUS_CONFIG = {
    pending: {
        label: "受付中",
        color: "#f59e0b",
        bg: "#fef3c7",
        border: "#fde68a",
        desc: "担当者が確認中です。確定後にメールでお知らせします。",
        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    confirmed: {
        label: "予約確定",
        color: "#1a6bb5",
        bg: "#dbeafe",
        border: "#bfdbfe",
        desc: "ご予約が確定しました。当日はお時間に余裕をもってお越しください。",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    completed: {
        label: "診療完了",
        color: "#059669",
        bg: "#d1fae5",
        desc: "ご来院ありがとうございました。またのご利用をお待ちしております。",
        icon: "M5 13l4 4L19 7",
    },
    cancelled: {
        label: "キャンセル済み",
        color: "#dc2626",
        bg: "#fee2e2",
        border: "#fecaca",
        desc: "この予約はキャンセルされました。",
        icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
};

/**
 * SVG アイコンコンポーネント
 */
function StatusIcon({ path, color, size = 20 }) {
    return (
        <svg
            width={size}
            height={size}
            fill="none"
            viewBox="0 0 24 24"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d={path} />
        </svg>
    );
}

// 詳細行 (ラベルと値を横並びに表示)
function DetailRow({ label, value, children }) {
    return (
        <div className="flex items-start justify-between py-4 gap-4">
            <span
                className="text-xs font-semibold tracking-widest uppercase shrink-0"
                style={{
                    color: CLINIC_COLORS.textSub,
                    letterSpacing: "0.06em",
                }}
            >
                {label}
            </span>
            <span
                className="text-sm font-medium text-right"
                style={{ color: CLINIC_COLORS.textPrimary }}
            >
                {children ?? value}
            </span>
        </div>
    );
}

/**
 * メインコンポーネント
 */
export default function Show({ auth, reservation }) {
    const [showDialog, setShowDialog] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const status = STATUS_CONFIG[reservation.status] ?? STATUS_CONFIG.pending;

    // キャンセル実行
    const handleCancel = () => {
        setCancelling(true);
        router.delete(route("reservations.destroy", reservation.id), {
            onSuccess: () => setShowDialog(false),
            onError: () => setCancelling(false),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="予約詳細" />

            {/* ページバナー (ステータスカラーで色が変わる) */}
            <div
                className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-8 px-4 sm:px-6 lg:px-8 py-8"
                style={{ backgroundColor: CLINIC_COLORS.navy }}
            >
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-4"
                    >
                        {/* ステータスアイコン */}
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                                backgroundColor: "rgba(26,107,181,0.35)",
                                border: "1px solid rgba(96,165,250,0.2)",
                            }}
                        >
                            <StatusIcon
                                path={status.icon}
                                color="#60a5fa"
                                size={22}
                            />
                        </div>
                        <div>
                            {/* ステータスバッジ */}
                            <span
                                className="text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block mb-1.5"
                                style={{
                                    backgroundColor: "rgba(26,107,181,0.35)",
                                    color: "#60a5fa",
                                }}
                            >
                                予約詳細
                            </span>
                            <h1
                                className="text-xl font-bold"
                                style={{ color: "#ffffff" }}
                            >
                                {reservation.reserved_at}
                            </h1>
                            <p
                                className="text-sm mt-0.5"
                                style={{ color: "#8ba8c8" }}
                            >
                                ～ {reservation.end_at} まで
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* コンテンツエリア */}
            <div className="max-w-2xl mx-auto py-8 space-y-5">
                {/* 戻るリンク */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Link
                        href={route("reservations.index")}
                        className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
                        style={{ color: CLINIC_COLORS.blue }}
                    >
                        <svg
                            className="w-4 h-5"
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
                        予約一覧に戻る
                    </Link>
                </motion.div>

                {/* ステータスカード */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                >
                    <div
                        className="rounded-2xl p-5 flex items-start gap-4"
                        style={{
                            backgroundColor: status.bg,
                            border: `1px solid ${status.border}`,
                        }}
                    >
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                            style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                        >
                            <StatusIcon
                                path={status.icon}
                                color={status.color}
                                size={18}
                            />
                        </div>
                        <div>
                            <p
                                className="text-sm font-bold"
                                style={{ color: status.color }}
                            >
                                {status.label}
                            </p>
                            <p
                                className="text-xs mt-1 leading-relaxed"
                                style={{ color: status.color, opacity: 0.8 }}
                            >
                                {status.desc}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* 予約詳細カード */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                >
                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                            backgroundColor: "white",
                            border: `1px solid ${CLINIC_COLORS.cardBorder}`,
                        }}
                    >
                        {/* カードヘッダー */}
                        <div
                            className="px-6 py-5"
                            style={{
                                borderBottom: `1px solid ${CLINIC_COLORS.divider}`,
                            }}
                        >
                            <h2
                                className="text-base font-bold"
                                style={{ color: CLINIC_COLORS.textPrimary }}
                            >
                                予約内容
                            </h2>
                        </div>

                        {/* 詳細行 */}
                        <div
                            className="px-6 divide-y"
                            style={{ borderColor: CLINIC_COLORS.divider }}
                        >
                            <DetailRow label="予約日時">
                                {reservation.reserved_at}
                                <span>
                                    <span
                                        className="ml-1.5 text-xs"
                                        style={{
                                            color: CLINIC_COLORS.textMuted,
                                        }}
                                    >
                                        ～ {reservation.end_at}
                                    </span>
                                </span>
                            </DetailRow>

                            <DetailRow label="ステータス">
                                <span
                                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                                    style={{
                                        backgroundColor: status.bg,
                                        color: status.color,
                                    }}
                                >
                                    {status.label}
                                </span>
                            </DetailRow>

                            <DetailRow
                                label="申込日"
                                value={reservation.created_at}
                            />

                            {reservation.notes && (
                                <DetailRow
                                    label="備考"
                                    value={reservation.notes}
                                />
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* キャンセルボタン (キャンセル可能な場合のみ表示) */}
                <AnimatePresence>
                    {reservation.is_cancellable && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ delay: 0.25, duration: 0.3 }}
                        >
                            <div
                                className="rounded-2xl overflow-hidden"
                                style={{
                                    backgroundColor: "white",
                                    border: `1px solid ${CLINIC_COLORS.cardBorder}`,
                                }}
                            >
                                <div className="px-6 py-5">
                                    <h3
                                        className="text-sm font-bold mb-1"
                                        style={{
                                            color: CLINIC_COLORS.textPrimary,
                                        }}
                                    >
                                        予約のキャンセル
                                    </h3>
                                    <p
                                        className="text-xs mb-4"
                                        style={{
                                            color: CLINIC_COLORS.textMuted,
                                        }}
                                    >
                                        キャンセル後は取り消しができません。ご注意ください。
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setShowDialog(true)}
                                        className="w-full py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                                        style={{
                                            backgroundColor: "#fef2f2",
                                            color: "#dc2626",
                                            border: "1.5px solid #fecaca",
                                        }}
                                    >
                                        この予約をキャンセルする
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 新規予約ボタン（完了・キャンセル時に表示） */}
                {["completed", "cancelled"].includes(reservation.status) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <Link
                            href={route("reservations.create")}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: CLINIC_COLORS.blue }}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            新しい予約をする
                        </Link>
                    </motion.div>
                )}
            </div>

            {/* キャンセル確認モーダル */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>予約をキャンセルしますか？</DialogTitle>
                        <DialogDescription>
                            この操作は取り消せません。
                            <span
                                className="block mt-2 font-semibold"
                                style={{ color: CLINIC_COLORS.textPrimary }}
                            >
                                {reservation.reserved_at}
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        {/* 戻るボタン */}
                        <button
                            onClick={() => setShowDialog(false)}
                            disabled={cancelling}
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                            style={{
                                backgroundColor: "white",
                                color: CLINIC_COLORS.textSub,
                                border: `1px solid ${CLINIC_COLORS.cardBorder}`,
                            }}
                        >
                            戻る
                        </button>
                        {/* キャンセル実行ボタン */}
                        <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                            style={{
                                backgroundColor: "#dc2626",
                                color: "white",
                                border: "none",
                            }}
                        >
                            {cancelling ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin w-4 h-4"
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
                                    処理中...
                                </span>
                            ) : (
                                "キャンセルする"
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
