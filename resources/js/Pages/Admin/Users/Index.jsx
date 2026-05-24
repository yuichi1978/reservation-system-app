import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import {
    PageHero,
    PageCard,
    CardBody,
    EmptyState,
    ClinicInput,
    ClinicButton,
    FlashMessage,
    Pagination,
    ListRow,
    CLINIC_COLORS,
} from "@/Components/UI";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

/**
 * ユーザーアバター
 */
function UserAvatar({ name, size = 36 }) {
    return (
        <div
            className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
            style={{
                width: size,
                height: size,
                backgroundColor: CLINIC_COLORS.blue,
                fontSize: size * 0.36,
            }}
        >
            {name ? name.charAt(0).toUpperCase() : "?"}
        </div>
    );
}

export default function Index({ auth, users, filters = {}, flash = {} }) {
    const [keyword, setKeyword] = useState(filters.search ?? "");

    // 検索実行
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.users.index"),
            keyword ? { search: keyword } : {},
            { preserveState: true, replace: true },
        );
    };

    // 検索リセット
    const handleReset = () => {
        setKeyword("");
        router.get(route("admin.users.index"));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="ユーザー管理" />

            <PageHero
                title="ユーザー管理"
                description={`登録ユーザー ${users.total} 名`}
                icon="users"
            />

            <div className="max-w-5xl mx-auto py-8 space-y-5">
                <FlashMessage success={flash.success} />

                {/* 検索フォーム */}
                <PageCard title="ユーザーを検索">
                    <CardBody>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <ClinicInput
                                placeholder="名前・メールアドレスで検索"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="max-w-sm"
                            />
                            <ClinicButton type="submit">検索</ClinicButton>
                            {keyword && (
                                <ClinicButton
                                    type="button"
                                    variant="secondary"
                                    onClick={handleReset}
                                >
                                    クリア
                                </ClinicButton>
                            )}
                        </form>
                    </CardBody>
                </PageCard>

                {/* ユーザーリスト */}
                <div className="space-y-2">
                    {users.data.length === 0 ? (
                        <EmptyState
                            message="ユーザーが見つかりませんでした"
                            icon="users"
                        />
                    ) : (
                        users.data.map((user, index) => (
                            <ListRow key={user.id} index={index}>
                                <div className="flex items-center gap-3 min-w-0">
                                    <UserAvatar name={user.name} />
                                    <div className="min-w-0">
                                        <p
                                            className="font-semibold text-sm truncate"
                                            style={{
                                                color: CLINIC_COLORS.textPrimary,
                                            }}
                                        >
                                            {user.name}
                                        </p>
                                        <p
                                            className="text-xs truncate"
                                            style={{
                                                color: CLINIC_COLORS.textMuted,
                                            }}
                                        >
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <span
                                        className="text-xs font-medium px-2.5 py-1 rounded-full hidden sm:inline-block"
                                        style={{
                                            backgroundColor:
                                                CLINIC_COLORS.blueLight,
                                            color: CLINIC_COLORS.blue,
                                        }}
                                    >
                                        予約 {user.reservations_count} 件
                                    </span>
                                    <span
                                        className="text-xs hidden lg:block"
                                        style={{
                                            color: CLINIC_COLORS.textMuted,
                                        }}
                                    >
                                        登録：{user.created_at}
                                    </span>
                                    <ClinicButton
                                        variant="secondary"
                                        onClick={() =>
                                            router.get(
                                                route(
                                                    "admin.users.show",
                                                    user.id,
                                                ),
                                            )
                                        }
                                    >
                                        詳細
                                    </ClinicButton>
                                </div>
                            </ListRow>
                        ))
                    )}
                </div>

                <Pagination links={users.links} />
            </div>
        </AuthenticatedLayout>
    );
}
