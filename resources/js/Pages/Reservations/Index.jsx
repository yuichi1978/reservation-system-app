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
    FlashMessage,
    Pagination,
    ListRow,
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

export default function Index({
    auth,
    reservations,
    filters = {},
    flash = {},
}) {
    const [search, setSearch] = useState({ ...DEFAULT_FILTERS, ...filters });
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
                description={`全 ${reservations.total} 件`}
                icon="calendar"
            />

            <div className="max-w-5xl mx-auto py-8 space-y-6">
                <FlashMessage success={flash.success} />

                {/* 検索エリア */}
                <PageCard title="絞り込み検索">
                    <CardBody>
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end"
                        >
                            <div className="flex-[2] space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">
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
                                <label className="text-xs font-bold text-slate-500 uppercase">
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
                                <label className="text-xs font-bold text-slate-500 uppercase">
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
                            <div className="flex gap-2 lg:w-56">
                                <ClinicButton type="submit" className="flex-1">
                                    検索
                                </ClinicButton>
                                <ClinicButton
                                    type="button"
                                    variant="secondary"
                                    onClick={handleReset}
                                    className="lg:w-24"
                                >
                                    リセット
                                </ClinicButton>
                            </div>
                        </form>
                    </CardBody>
                </PageCard>

                {/* リスト表示 */}
                <div className="space-y-4">
                    {reservations.data.length === 0 ? (
                        <EmptyState
                            message="該当する予約が見つかりませんでした。"
                            icon="calendar"
                        />
                    ) : (
                        reservations.data.map((r, index) => (
                            <ListRow key={r.id} index={index}>
                                <div className="flex items-center gap-6 min-w-0">
                                    <div className="text-center min-w-[70px]">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            {r.reserved_date}
                                        </p>
                                        <p className="text-base font-bold text-slate-800">
                                            {r.reserved_time}
                                        </p>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-900 truncate">
                                            {r.user_name} 様
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">
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
                            </ListRow>
                        ))
                    )}
                </div>
                <Pagination links={reservations.links} />
            </div>

            {/* ステータス変更モーダル */}
            <Dialog open={!!target} onOpenChange={() => setTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ステータス変更</DialogTitle>
                        <DialogDescription>
                            {target?.user_name} 様の予約状態を更新します。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger className="w-full h-12">
                                <SelectValue placeholder="新しい状態を選択" />
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
                                                に変更
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
                            更新を保存
                        </ClinicButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
