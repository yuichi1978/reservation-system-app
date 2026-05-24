import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    PageHero,
    PageCard,
    CardBody,
    StatusBadge,
    EmptyState,
    ClinicInput,
    ClinicButton,
    // FlashMessage, Pagination, ListRow は UI.jsx で定義されている前提
    Pagination,
    STATUS_CONFIG,
    CLINIC_COLORS,
} from "@/Components/UI";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const NEXT_STATUS = {
    pending: {
        options: ["confirmed", "cancelled"],
        labels: { confirmed: "予約確定", cancelled: "キャンセル" },
    },
    confirmed: {
        options: ["completed", "cancelled"],
        labels: { completed: "完了", cancelled: "キャンセル" },
    },
};

const DEFAULT_FILTERS = { keyword: "", date: "", status: "all" };

export default function Index({ auth, reservations, filters = {} }) {
    const [search, setSearch] = useState({
        ...DEFAULT_FILTERS,
        ...filters,
        status: filters.status || "all",
    });

    const [target, setTarget] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [updating, setUpdating] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.reservations.index"),
            Object.fromEntries(
                Object.entries(search).filter(([, v]) => v && v !== "all"),
            ),
            { preserveState: true, replace: true },
        );
    };

    const handleReset = () => {
        setSearch(DEFAULT_FILTERS);
        router.get(route("admin.reservations.index"));
    };

    const handleUpdate = () => {
        if (!target || !newStatus) return;
        setUpdating(true);
        router.patch(
            route("admin.reservations.update", target.id),
            { status: newStatus },
            {
                onSuccess: () => {
                    setTarget(null);
                    setNewStatus("");
                    setUpdating(false);
                },
                onError: () => setUpdating(false),
            },
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="予約管理" />

            <PageHero
                title="予約管理"
                description={`全 ${reservations.total} 件の予約`}
                icon="calendar"
            />

            <div className="max-w-5xl mx-auto py-8 space-y-6">
                {/* 検索エリア */}
                <PageCard title="絞り込み検索">
                    <CardBody>
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end"
                        >
                            <div className="flex-[2] space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">
                                    名前・メール
                                </label>
                                <ClinicInput
                                    placeholder="検索..."
                                    value={search.keyword}
                                    onChange={(e) =>
                                        setSearch({
                                            ...search,
                                            keyword: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="lg:w-44 space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">
                                    日付
                                </label>
                                <ClinicInput
                                    type="date"
                                    value={search.date}
                                    onChange={(e) =>
                                        setSearch({
                                            ...search,
                                            date: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="lg:w-40 space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">
                                    状態
                                </label>
                                <Select
                                    value={search.status}
                                    onValueChange={(v) =>
                                        setSearch({ ...search, status: v })
                                    }
                                >
                                    <SelectTrigger className="!h-11">
                                        <SelectValue placeholder="すべて" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            すべて
                                        </SelectItem>
                                        {Object.entries(STATUS_CONFIG).map(
                                            ([k, v]) => (
                                                <SelectItem key={k} value={k}>
                                                    {v.label}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2 lg:w-48">
                                <ClinicButton type="submit" className="flex-1">
                                    検索
                                </ClinicButton>
                                <ClinicButton
                                    type="button"
                                    variant="secondary"
                                    onClick={handleReset}
                                >
                                    クリア
                                </ClinicButton>
                            </div>
                        </form>
                    </CardBody>
                </PageCard>

                {/* 予約リスト */}
                {reservations.data.length > 0 ? (
                    <div className="space-y-4">
                        {reservations.data.map((r) => (
                            <PageCard key={r.id}>
                                <div className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="text-center min-w-[80px]">
                                            <p className="text-xs text-slate-500 font-bold uppercase">
                                                {r.reserved_date}
                                            </p>
                                            <p className="text-lg font-bold text-slate-800">
                                                {r.reserved_time}
                                            </p>
                                        </div>
                                        <div className="h-10 w-px bg-slate-100" />
                                        <div>
                                            <p className="font-bold text-slate-900">
                                                {r.user_name} 様
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {r.user_email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <StatusBadge status={r.status} />
                                        {NEXT_STATUS[r.status] && (
                                            <ClinicButton
                                                variant="secondary"
                                                onClick={() => {
                                                    setTarget(r);
                                                    setNewStatus("");
                                                }}
                                            >
                                                変更
                                            </ClinicButton>
                                        )}
                                    </div>
                                </div>
                            </PageCard>
                        ))}
                        <Pagination links={reservations.links} />
                    </div>
                ) : (
                    <EmptyState
                        message="該当する予約が見つかりませんでした。"
                        icon="calendar"
                    />
                )}
            </div>

            {/* ステータス変更モーダル */}
            <Dialog open={!!target} onOpenChange={() => setTarget(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>ステータスの変更</DialogTitle>
                        <DialogDescription>
                            {target?.user_name} 様 の予約状態を更新します。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select
                            value={newStatus}
                            onValueChange={(value) => setNewStatus(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="状態を選択してください" />
                            </SelectTrigger>
                            <SelectContent>
                                {target &&
                                    NEXT_STATUS[target.status]?.options.map(
                                        (opt) => (
                                            <SelectItem key={opt} value={opt}>
                                                {
                                                    NEXT_STATUS[target.status]
                                                        .labels[opt]
                                                }
                                                にする
                                            </SelectItem>
                                        ),
                                    )}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <ClinicButton
                            variant="secondary"
                            onClick={() => setTarget(null)}
                        >
                            キャンセル
                        </ClinicButton>
                        <ClinicButton
                            onClick={handleUpdate}
                            disabled={!newStatus || updating}
                        >
                            更新を確定
                        </ClinicButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
