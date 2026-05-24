import { motion } from "framer-motion";

/**
 * 全ページで使いまわす共通UIパーツをまとめたファイルです。
 * このファイル1つをimportするだけで統一デザインが使えます。
 *
 * 使い方：
 * import {PageHero, PageCard, StatusBadge, EmptyState} from "@/Components/UI";
 */

/**
 * カラー定数 (全ページで統一)
 */
export const CLINIC_COLORS = {
    navy: "#0a1628",
    navyBorder: "#1e2d45",
    blue: "#1a6bb5",
    blueLight: "#eef4fb",
    bodyBg: "#f0f4f8",
    cardBorder: "#dde8f2",
    textPrimary: "#1a2e4a",
    textMuted: "#90a4b7",
    textSub: "#607d9a",
    divider: "#f0f4f8",
    inputBg: "#fafcff",
    footerBg: "#fafcff",
};

/**
 * ステータス設定 (予約管理・ユーザー管理で共通利用)
 */
export const STATUS_CONFIG = {
    pending: { label: "仮予約", color: "#f59e0b", bg: "#fef3c7" },
    confirmed: { label: "予約確定", color: "#1a6bb5", bg: "#dbeafe" },
    completed: { label: "完了", color: "#059669", bg: "#d1fae5" },
    cancelled: { label: "キャンセル", color: "#dc2626", bg: "#fee2e2" },
};

/**
 * PageHero - ページ上部のダークバナー (全管理ページ共通)
 *
 * 使い方：
 *  <PageHero title="予約管理" description="ステータスの確認と変更" />
 *  <PageHero title="営業時間設定" icon="clock" badge="管理者" />
 */
export function PageHero({
    title,
    description,
    badge = "管理者",
    icon = "default",
    children,
}) {
    return (
        <div
            className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-8 px-4 sm:px-6 lg:px-8 py-8"
            style={{ backgroundColor: CLINIC_COLORS.navy }}
        >
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-4"
                >
                    {/* アイコン */}
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                            backgroundColor: "rgba(26, 107, 181, 0.35)",
                            border: "1px solid rgba(96, 165, 250, 0.2)",
                        }}
                    >
                        <HeroIcon type={icon} />
                    </div>
                    <div>
                        {/* 管理者バッジ */}
                        <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-1.5"
                            style={{
                                backgroundColor: "#0d2e23",
                                color: "#34d399",
                            }}
                        >
                            {badge}
                        </span>
                        <h1
                            className="text-xl font-bold"
                            style={{ color: "#ffffff" }}
                        >
                            {title}
                        </h1>
                        {description && (
                            <p
                                className="text-sm mt-0.5"
                                style={{ color: "#8ba8c8" }}
                            >
                                {description}
                            </p>
                        )}
                    </div>
                </motion.div>
                {/* 右側スロット (ボタンなど) */}
                {children && <div>{children}</div>}
            </div>
        </div>
    );
}

// ヒーロー用アイコン
function HeroIcon({ type }) {
    const icons = {
        calendar:
            "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
        clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
        default:
            "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    };

    return (
        <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#60a5fa"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d={icons[type] ?? icons.default} />
        </svg>
    );
}

/**
 * PageCard - 白いコンテンツカード
 *
 * 使い方
 *  <PageCard>...</PageCard>
 *  <PageCard title="検索" description="条件を指定">...</PageCard>
 */
export function PageCard({ title, description, children, className = "" }) {
    return (
        <div
            className={`rounded-2xl overflow-hidden ${className}`}
            style={{
                backgroundColor: "white",
                border: `1px solid ${CLINIC_COLORS.cardBorder}`,
            }}
        >
            {(title || description) && (
                <div
                    className="px-6 py-5"
                    style={{
                        borderBottom: `1px solid ${CLINIC_COLORS.divider}`,
                    }}
                >
                    {title && (
                        <h2
                            className="text-base font-bold"
                            style={{ color: CLINIC_COLORS.textPrimary }}
                        >
                            {title}
                        </h2>
                    )}
                    {description && (
                        <p
                            className="text-sm mt-0.5"
                            style={{ color: CLINIC_COLORS.textMuted }}
                        >
                            {description}
                        </p>
                    )}
                </div>
            )}
            {children}
        </div>
    );
}

/**
 * CardBody / CardFooter - カード内セクション
 */
export function CardBody({ children, className = "" }) {
    return <div className={`px-6 py-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children }) {
    return (
        <div
            className="px-6 py-4 flex justify-end"
            style={{
                borderTop: `1px solid ${CLINIC_COLORS.divider}`,
                backgroundColor: CLINIC_COLORS.footerBg,
            }}
        >
            {children}
        </div>
    );
}

/**
 * StatusBadge - ステータスの色付きで表示
 */
export function StatusBadge({ status }) {
    const s = STATUS_CONFIG[status] ?? {
        label: status,
        color: "#6b7280",
        bg: "#f3f4f6",
    };
    return (
        <span
            className="text-xs font-semibold px-2.5 py-1.5 rounded-full"
            style={{ backgroundColor: s.bg, color: s.color }}
        >
            {s.label}
        </span>
    );
}

/**
 * EmptyState - データ0件の時の表示
 */
export function EmptyState({
    message = "データがありません",
    icon = "default",
}) {
    return (
        <div
            className="rounded-xl p-12 text-center"
            style={{
                border: `2px solid ${CLINIC_COLORS.cardBorder}`,
                backgroundColor: "white",
            }}
        >
            <div
                className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: CLINIC_COLORS.blueLight }}
            >
                <HeroIcon type={icon} />
            </div>
            <p className="text-sm" style={{ color: CLINIC_COLORS.textMuted }}>
                {message}
            </p>
        </div>
    );
}

/**
 * ClinicInput - 統一スタイルの　input　要素
 */
export function ClinicInput({ className = "", ...props }) {
    return (
        <input
            className={`w-full h-11 px-3.5 rounded-lg text-sm outline-none transition-colors ${className}`}
            style={{
                border: `1.5px solid ${CLINIC_COLORS.cardBorder}`,
                backgroundColor: CLINIC_COLORS.inputBg,
                color: CLINIC_COLORS.textPrimary,
            }}
            onFocus={(e) => {
                e.target.style.borderColor = CLINIC_COLORS.blue;
            }}
            onBlur={(e) => {
                e.target.style.borderColor = CLINIC_COLORS.cardBorder;
            }}
            {...props}
        />
    );
}

/**
 * ClinicButton - 統一スタイルのメインボタン
 */
export function ClinicButton({
    children,
    disabled,
    onClick,
    type = "button",
    size = "md",
    variant = "primary",
    className = "",
}) {
    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-2.5 text-sm",
        lg: "px-8 py-3 text-sm",
    };
    const styles = {
        primary: {
            backgroundColor: CLINIC_COLORS.blue,
            color: "white",
            border: "none",
        },
        outline: {
            backgroundColor: "white",
            color: CLINIC_COLORS.blue,
            border: `1.5px solid ${CLINIC_COLORS.blue}`,
        },
        ghost: {
            backgroundColor: "transparent",
            color: CLINIC_COLORS.textSub,
            border: `1px solid ${CLINIC_COLORS.cardBorder}`,
        },
    };
    return (
        <motion.button
            type={type}
            disabled={disabled}
            onClick={onClick}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`rounded-lg font-semibold transition-opacity disabled:opacity-50 ${sizes[size]} ${className}`}
            style={styles[variant] ?? styles.primary}
        >
            {children}
        </motion.button>
    );
}

/**
 * FlashMessage - 成功・エラーのフラッシュメッセージ
 */
export function FlashMessage({ success, error }) {
    if (!success && !error) return null;
    const isSuccess = !!success;
    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg text-sm flex items-center gap-2"
            style={
                isSuccess
                    ? {
                          backgroundColor: "#f0fdf4",
                          color: "#166534",
                          border: "1px solid #86efac",
                      }
                    : {
                          backgroundColor: "#fef2f2",
                          color: "#991b1b1",
                          border: "1px solid #fca5a5",
                      }
            }
        >
            <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={isSuccess ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                />
            </svg>
            {success || error}
        </motion.div>
    );
}

/**
 * Pagination - ページネーションボタン
 */
export function Pagination({ links = [], onNavigate }) {
    if (links.length <= 3) return null; // 1ページのみなら非表示
    return (
        <div className="flex justify-center gap-1.5 pt-4">
            {links.map((link, i) => (
                <button
                    key={i}
                    disabled={!link.url}
                    onClick={() => link.url && onNavigate(link.url)}
                    className="min-w-9 h-9 px-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
                    style={
                        link.active
                            ? {
                                  backgroundColor: CLINIC_COLORS.blue,
                                  color: "white",
                              }
                            : {
                                  backgroundColor: "white",
                                  color: CLINIC_COLORS.textSub,
                                  border: `1px solid ${CLINIC_COLORS.cardBorder}`,
                              }
                    }
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}

/**
 * ListRow - 一覧の各行 (ホバーエフェクト付き)
 */
export function ListRow({ children, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
        >
            <div
                className="rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-shadow"
                style={{
                    backgroundColor: "white",
                    border: `1px solid ${CLINIC_COLORS.cardBorder}`,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(26, 107, 181, 0.08)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                }}
            >
                {children}
            </div>
        </motion.div>
    );
}
