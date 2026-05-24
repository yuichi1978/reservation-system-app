import { Head, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    PageHero,
    ClinicInput,
    ClinicButton,
    FlashMessage,
    CLINIC_COLORS,
} from "@/Components/UI";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];
const INTERVALS = [
    { value: "15", label: "15分間隔" },
    { value: "30", label: "30分間隔" },
    { value: "60", label: "60分間隔" },
];

export default function Index({ auth, schedules = [], flash = {} }) {
    const { data, setData, patch, processing } = useForm({ schedules });

    // 特定曜日のフィールドを更新
    const update = (index, field, value) => {
        setData(
            "schedules",
            data.schedules.map((item, idx) =>
                idx !== index ? item : { ...item, [field]: value },
            ),
        );
    };

    // 定休日トグル時は時刻リセット
    const toggleHoliday = (index, value) => {
        setData(
            "schedules",
            data.schedules.map((item, idx) =>
                idx !== index
                    ? item
                    : {
                          ...item,
                          is_holiday: value,
                          open_time: value ? "" : item.open_time,
                          close_time: value ? "" : item.close_time,
                      },
            ),
        );
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route("admin.schedules.bulk-update"));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="営業時間設定" />

            <PageHero
                title="営業時間設定"
                description="曜日ごとの営業時間・予約間隔を設定してください"
                icon="clock"
            />

            <div className="max-w-4xl mx-auto py-8 space-y-5">
                <FlashMessage success={flash.success} />

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-3">
                        {data.schedules.map((schedule, index) => (
                            <motion.div
                                key={schedule.day_of_week}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div
                                    className="rounded-2xl overflow-hidden shadow-sm"
                                    style={{
                                        backgroundColor: "white",
                                        border: `1px solid ${CLINIC_COLORS.cardBorder}`,
                                        opacity: schedule.is_holiday ? 0.7 : 1,
                                    }}
                                >
                                    <div className="px-6 py-5 flex flex-wrap items-center gap-6">
                                        {/* 曜日 */}
                                        <div className="w-24 shrink-0">
                                            <span
                                                className="text-lg font-bold"
                                                style={{
                                                    color: CLINIC_COLORS.textPrimary,
                                                }}
                                            >
                                                {
                                                    DAY_NAMES[
                                                        schedule.day_of_week
                                                    ]
                                                }
                                                曜日
                                            </span>
                                        </div>

                                        {/* スイッチ */}
                                        <div className="flex items-center gap-3 w-40">
                                            <Switch
                                                checked={schedule.is_holiday}
                                                onCheckedChange={(val) =>
                                                    toggleHoliday(index, val)
                                                }
                                            />
                                            <span
                                                className="text-sm font-medium"
                                                style={{
                                                    color: CLINIC_COLORS.textSub,
                                                }}
                                            >
                                                {schedule.is_holiday
                                                    ? "休診日"
                                                    : "診療日"}
                                            </span>
                                        </div>

                                        {/* 設定エリア */}
                                        {!schedule.is_holiday && (
                                            <div className="flex items-center gap-4 flex-wrap flex-1">
                                                <div className="flex items-center gap-2">
                                                    <ClinicInput
                                                        type="time"
                                                        value={
                                                            schedule.open_time ||
                                                            ""
                                                        }
                                                        className="w-32"
                                                        onChange={(e) =>
                                                            update(
                                                                index,
                                                                "open_time",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <span className="text-slate-400">
                                                        ～
                                                    </span>
                                                    <ClinicInput
                                                        type="time"
                                                        value={
                                                            schedule.close_time ||
                                                            ""
                                                        }
                                                        className="w-32"
                                                        onChange={(e) =>
                                                            update(
                                                                index,
                                                                "close_time",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="w-40">
                                                    <Select
                                                        value={String(
                                                            schedule.slot_interval_minutes,
                                                        )}
                                                        onValueChange={(val) =>
                                                            update(
                                                                index,
                                                                "slot_interval_minutes",
                                                                val,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-11">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {INTERVALS.map(
                                                                (int) => (
                                                                    <SelectItem
                                                                        key={
                                                                            int.value
                                                                        }
                                                                        value={
                                                                            int.value
                                                                        }
                                                                    >
                                                                        {
                                                                            int.label
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4">
                        <ClinicButton
                            disabled={processing}
                            className="w-full sm:w-48 shadow-lg shadow-blue-900/20"
                        >
                            設定を保存する
                        </ClinicButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
