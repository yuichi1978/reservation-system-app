// ============================================================
// ファイルパス: resources/js/Pages/Reservations/Create.jsx
// 配置先: your-project/resources/js/Pages/Reservations/Create.jsx
// 既存ファイルをこの内容で上書きしてください
//
// ============================================================
// 【修正箇所】
//   1. setData() の書き方を修正
//      ❌ setData({ ...data, reserved_date: ... })  オブジェクト渡しはNG
//      ✅ setData("reserved_date", value)            フィールド名を個別に指定
//
//   2. availableSlots の取得を確実にする
//      定休日でも営業日でも正しく判定できるよう条件を整理
//
//   3. デバッグ用コンソールを追加
//      問題が起きたときにどのデータが来ているか確認できる
// ============================================================

import { Head, useForm } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FullCalendar from "@fullcalendar/react";
import daygrid from "@fullcalendar/daygrid";
import interaction from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { CLINIC_COLORS } from "@/Components/UI";

// ============================================================
// ステップインジケーター
// ============================================================
function CheckIcon() {
    return (
        <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 13l4 4L19 7" />
        </svg>
    );
}

function StepIndicator({ currentStep }) {
    const steps = ["日付を選ぶ", "時間を選ぶ", "確認・送信"];
    return (
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-1">
            {steps.map((label, i) => {
                const stepNum = i + 1;
                const active = currentStep === stepNum;
                const done = currentStep > stepNum;
                return (
                    <div
                        key={label}
                        className="flex items-center gap-2 shrink-0"
                    >
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                            style={
                                done
                                    ? {
                                          backgroundColor: "#059669",
                                          color: "white",
                                      }
                                    : active
                                      ? {
                                            backgroundColor: CLINIC_COLORS.blue,
                                            color: "white",
                                        }
                                      : {
                                            backgroundColor:
                                                CLINIC_COLORS.cardBorder,
                                            color: CLINIC_COLORS.textMuted,
                                        }
                            }
                        >
                            {done ? <CheckIcon /> : stepNum}
                        </div>
                        <span
                            className="text-xs font-medium hidden sm:block"
                            style={{
                                color: active
                                    ? CLINIC_COLORS.textPrimary
                                    : CLINIC_COLORS.textMuted,
                            }}
                        >
                            {label}
                        </span>
                        {i < steps.length - 1 && (
                            <div
                                className="h-px w-6"
                                style={{
                                    backgroundColor: CLINIC_COLORS.cardBorder,
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function Create({ auth, schedules = [] }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        reserved_date: "",
        reserved_time: "",
        notes: "",
    });

    const currentStep = !selectedDate ? 1 : !selectedTime ? 2 : 3;

    // ============================================================
    // 選択した日付の曜日から営業スケジュールを検索する
    //
    // 【重要】new Date(dateStr) はタイムゾーンの影響で曜日がズレる場合がある
    // "2024-06-15" → UTCとして解釈 → 日本時間では前日になることがある
    // そのため "T00:00:00" を末尾に付けてローカル時間として解釈させる
    // ============================================================
    const selectedSchedule = useMemo(() => {
        if (!selectedDate) return null;

        // タイムゾーンずれを防ぐために "T00:00:00" を付ける
        const dayOfWeek = new Date(selectedDate + "T00:00:00").getDay();

        const found = schedules.find((s) => s.day_of_week === dayOfWeek);

        // ← デバッグ用（問題が解決したらこの2行を削除してOK）
        console.log(
            "選択日:",
            selectedDate,
            "曜日番号:",
            dayOfWeek,
            "スケジュール:",
            found,
        );
        console.log("全スケジュール:", schedules);

        return found ?? null;
    }, [selectedDate, schedules]);

    // 定休日かどうか
    const isHoliday = selectedSchedule?.is_holiday === true;

    // 予約可能な時間帯（定休日なら空配列）
    const availableSlots = isHoliday
        ? []
        : (selectedSchedule?.available_slots ?? []);

    // ============================================================
    // カレンダーの日付をクリックしたとき
    //
    // ❌ 間違い: setData({ ...data, reserved_date: info.dateStr })
    //    → useFormのsetDataはオブジェクトを受け取れない
    //
    // ✅ 正解: setData("フィールド名", 値) で個別に更新する
    // ============================================================
    const handleDateClick = (info) => {
        setSelectedDate(info.dateStr);
        setSelectedTime(null);
        setData("reserved_date", info.dateStr); // ← フィールド名を個別指定
        setData("reserved_time", ""); // ← 時間もリセット
    };

    // 時間帯を選択したとき
    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        setData("reserved_time", time);
    };

    // フォーム送信
    const submit = (e) => {
        e.preventDefault();
        post(route("reservations.store"));
    };

    // 日付を日本語表示（例: 2026年5月20日（水））
    const formattedDate = selectedDate
        ? new Date(selectedDate + "T00:00:00").toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
          })
        : null;

    const today = new Date().toISOString().split("T")[0];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="新規予約" />

            {/* ===== ページバナー ===== */}
            <div
                className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-8 px-4 sm:px-6 lg:px-8 py-8 mb-8"
                style={{ backgroundColor: CLINIC_COLORS.navy }}
            >
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-bold text-white">
                        新規予約申し込み
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "#8ba8c8" }}>
                        ご希望の日時を選択してください
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto pb-16">
                {/* ステップインジケーター */}
                <StepIndicator currentStep={currentStep} />

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* ===== 左：カレンダー ===== */}
                    <div
                        className="lg:col-span-7 rounded-2xl overflow-hidden p-4"
                        style={{
                            backgroundColor: "white",
                            border: `1px solid ${CLINIC_COLORS.cardBorder}`,
                        }}
                    >
                        <FullCalendar
                            plugins={[daygrid, interaction]}
                            initialView="dayGridMonth"
                            locale={jaLocale}
                            dateClick={handleDateClick}
                            height="auto"
                            validRange={{ start: today }}
                            headerToolbar={{
                                left: "prev",
                                center: "title",
                                right: "next,today",
                            }}
                            dayCellClassNames={(arg) => {
                                const dateStr =
                                    arg.date.toLocaleDateString("en-CA");
                                return dateStr === selectedDate
                                    ? ["fc-day-selected"]
                                    : [];
                            }}
                        />
                        <style>{`
                            .fc-day-selected .fc-daygrid-day-frame {
                                background-color: rgba(26,107,181,0.12) !important;
                                border-radius: 6px;
                            }
                            .fc-day-selected .fc-daygrid-day-number {
                                color: #1a6bb5 !important;
                                font-weight: 700;
                            }
                            .fc-button-primary {
                                background-color: #1a6bb5 !important;
                                border-color: #1a6bb5 !important;
                                border-radius: 8px !important;
                                font-size: 13px !important;
                            }
                            .fc-toolbar-title { font-size: 16px !important; font-weight: 700 !important; color: #1a2e4a; }
                            .fc-daygrid-day-number { font-size: 13px; color: #607d9a; }
                            .fc-day-today .fc-daygrid-day-number { color: #1a6bb5 !important; font-weight: 700; }
                            .fc-col-header-cell-cushion { font-size: 12px; color: #90a4b7; }
                            .fc-day-past { opacity: 0.4; }
                        `}</style>
                    </div>

                    {/* ===== 右：時間帯 + フォーム ===== */}
                    <div className="lg:col-span-5 space-y-4">
                        <AnimatePresence mode="wait">
                            {/* 日付未選択 */}
                            {!selectedDate && (
                                <motion.div
                                    key="no-date"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="rounded-2xl p-10 text-center"
                                    style={{
                                        border: `2px dashed ${CLINIC_COLORS.cardBorder}`,
                                        backgroundColor: "white",
                                        color: CLINIC_COLORS.textMuted,
                                    }}
                                >
                                    <svg
                                        className="w-10 h-10 mx-auto mb-3 opacity-40"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke={CLINIC_COLORS.blue}
                                        strokeWidth={1.5}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm">
                                        左のカレンダーから
                                        <br />
                                        日付を選択してください
                                    </p>
                                </motion.div>
                            )}

                            {/* 日付選択済み */}
                            {selectedDate && (
                                <motion.div
                                    key="selected"
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    {/* 選択した日付の表示 */}
                                    <div
                                        className="rounded-2xl p-5"
                                        style={{
                                            backgroundColor: "white",
                                            border: `1px solid ${CLINIC_COLORS.cardBorder}`,
                                        }}
                                    >
                                        <p
                                            className="text-xs font-semibold tracking-widest uppercase mb-1"
                                            style={{
                                                color: CLINIC_COLORS.textSub,
                                            }}
                                        >
                                            選択した日
                                        </p>
                                        <p
                                            className="text-xl font-bold"
                                            style={{
                                                color: CLINIC_COLORS.blue,
                                            }}
                                        >
                                            {formattedDate}
                                        </p>
                                    </div>

                                    {/* 定休日 */}
                                    {isHoliday && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                scale: 0.97,
                                            }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="rounded-2xl p-5 text-center"
                                            style={{
                                                backgroundColor: "#fef3c7",
                                                border: "1px solid #fde68a",
                                            }}
                                        >
                                            <p
                                                className="text-sm font-bold"
                                                style={{ color: "#92400e" }}
                                            >
                                                この日は休診日です
                                            </p>
                                            <p
                                                className="text-xs mt-1"
                                                style={{ color: "#78350f" }}
                                            >
                                                別の日付を選択してください
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* 時間帯ボタン */}
                                    {!isHoliday && (
                                        <div
                                            className="rounded-2xl p-5"
                                            style={{
                                                backgroundColor: "white",
                                                border: `1px solid ${CLINIC_COLORS.cardBorder}`,
                                            }}
                                        >
                                            <p
                                                className="text-xs font-semibold tracking-widest uppercase mb-3"
                                                style={{
                                                    color: CLINIC_COLORS.textSub,
                                                }}
                                            >
                                                予約時間を選択
                                                <span
                                                    className="ml-2 font-normal normal-case"
                                                    style={{
                                                        color: CLINIC_COLORS.textMuted,
                                                    }}
                                                >
                                                    {availableSlots.length} 枠
                                                </span>
                                            </p>

                                            {availableSlots.length === 0 ? (
                                                <p
                                                    className="text-sm text-center py-4"
                                                    style={{
                                                        color: CLINIC_COLORS.textMuted,
                                                    }}
                                                >
                                                    空き時間がありません
                                                </p>
                                            ) : (
                                                <div className="grid grid-cols-3 gap-2">
                                                    {availableSlots.map(
                                                        (time, i) => (
                                                            <motion.button
                                                                key={time}
                                                                type="button"
                                                                initial={{
                                                                    opacity: 0,
                                                                    scale: 0.9,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    scale: 1,
                                                                }}
                                                                transition={{
                                                                    delay:
                                                                        i *
                                                                        0.02,
                                                                }}
                                                                whileHover={{
                                                                    scale: 1.04,
                                                                }}
                                                                whileTap={{
                                                                    scale: 0.96,
                                                                }}
                                                                onClick={() =>
                                                                    handleTimeSelect(
                                                                        time,
                                                                    )
                                                                }
                                                                className="py-2.5 rounded-lg text-sm font-bold transition-all"
                                                                style={
                                                                    selectedTime ===
                                                                    time
                                                                        ? {
                                                                              backgroundColor:
                                                                                  CLINIC_COLORS.blue,
                                                                              color: "white",
                                                                              border: "none",
                                                                          }
                                                                        : {
                                                                              backgroundColor:
                                                                                  CLINIC_COLORS.blueLight,
                                                                              color: CLINIC_COLORS.textPrimary,
                                                                              border: `1.5px solid ${CLINIC_COLORS.cardBorder}`,
                                                                          }
                                                                }
                                                            >
                                                                {time}
                                                            </motion.button>
                                                        ),
                                                    )}
                                                </div>
                                            )}

                                            {errors.reserved_time && (
                                                <p className="text-xs text-red-500 mt-2">
                                                    {errors.reserved_time}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* 備考 + 送信ボタン（時間選択後に表示） */}
                                    <AnimatePresence>
                                        {selectedTime && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div
                                                    className="rounded-2xl overflow-hidden"
                                                    style={{
                                                        backgroundColor:
                                                            "white",
                                                        border: `1px solid ${CLINIC_COLORS.cardBorder}`,
                                                    }}
                                                >
                                                    {/* 予約日時の確認 */}
                                                    <div
                                                        className="px-5 py-4 flex items-center gap-3"
                                                        style={{
                                                            backgroundColor:
                                                                CLINIC_COLORS.blueLight,
                                                            borderBottom: `1px solid ${CLINIC_COLORS.cardBorder}`,
                                                        }}
                                                    >
                                                        <svg
                                                            className="w-4 h-4 shrink-0"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke={
                                                                CLINIC_COLORS.blue
                                                            }
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <div>
                                                            <p
                                                                className="text-xs"
                                                                style={{
                                                                    color: CLINIC_COLORS.textSub,
                                                                }}
                                                            >
                                                                予約日時
                                                            </p>
                                                            <p
                                                                className="text-sm font-bold"
                                                                style={{
                                                                    color: CLINIC_COLORS.textPrimary,
                                                                }}
                                                            >
                                                                {formattedDate}{" "}
                                                                {selectedTime}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <form
                                                        onSubmit={submit}
                                                        className="p-5 space-y-4"
                                                    >
                                                        {/* 備考 */}
                                                        <div className="space-y-1.5">
                                                            <label
                                                                className="block text-xs font-semibold tracking-widest uppercase"
                                                                style={{
                                                                    color: CLINIC_COLORS.textSub,
                                                                }}
                                                            >
                                                                備考・症状
                                                                <span
                                                                    className="ml-2 font-normal normal-case"
                                                                    style={{
                                                                        color: CLINIC_COLORS.textMuted,
                                                                    }}
                                                                >
                                                                    任意
                                                                </span>
                                                            </label>
                                                            <textarea
                                                                rows={3}
                                                                value={
                                                                    data.notes
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "notes",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="気になる症状があれば入力してください"
                                                                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none resize-none transition-colors"
                                                                style={{
                                                                    border: `1.5px solid ${CLINIC_COLORS.cardBorder}`,
                                                                    backgroundColor:
                                                                        "#fafcff",
                                                                    color: CLINIC_COLORS.textPrimary,
                                                                }}
                                                                onFocus={(
                                                                    e,
                                                                ) => {
                                                                    e.target.style.borderColor =
                                                                        CLINIC_COLORS.blue;
                                                                }}
                                                                onBlur={(e) => {
                                                                    e.target.style.borderColor =
                                                                        CLINIC_COLORS.cardBorder;
                                                                }}
                                                            />
                                                        </div>

                                                        {/* 送信ボタン */}
                                                        <motion.button
                                                            type="submit"
                                                            disabled={
                                                                processing
                                                            }
                                                            whileHover={{
                                                                scale: processing
                                                                    ? 1
                                                                    : 1.01,
                                                            }}
                                                            whileTap={{
                                                                scale: processing
                                                                    ? 1
                                                                    : 0.99,
                                                            }}
                                                            className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                                                            style={{
                                                                backgroundColor:
                                                                    CLINIC_COLORS.blue,
                                                            }}
                                                        >
                                                            {processing ? (
                                                                <span className="flex items-center justify-center gap-2">
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
                                                                    送信中...
                                                                </span>
                                                            ) : (
                                                                "この内容で予約する"
                                                            )}
                                                        </motion.button>
                                                    </form>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
