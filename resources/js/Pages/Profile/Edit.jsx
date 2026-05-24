import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const TABS = [
    { value: "profile", label: "基本情報" },
    { value: "password", label: "パスワード" },
];

function Field({ label, error, optional = false, children }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500">
                {label}
                {optional && (
                    <span className="ml-2 font-normal lowercase text-slate-300">
                        任意
                    </span>
                )}
            </label>
            {children}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

export default function Edit({ auth, status }) {
    const user = auth.user;
    const [activeTab, setActiveTab] = useState("profile");

    const profileForm = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
    });

    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const initials = user.name ? user.name.charAt(0).toUpperCase() : "?";

    const updateProfile = (e) => {
        e.preventDefault();
        profileForm.patch(route("profile.update"));
    };

    const updatePassword = (e) => {
        e.preventDefault();
        passwordForm.put(route("password.update"), {
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <AuthenticatedLayout user={user}>
            <Head title="プロフィール設定" />

            {/* ヒーローバナー */}
            <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
                <div className="px-4 sm:px-6 lg:px-8 py-10 bg-[#0a1628]">
                    <div className="max-w-2xl mx-auto flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold bg-[#1a6bb5] border-2 border-white/10 shadow-lg">
                            {initials}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-white">
                                    {user.name}
                                </h1>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-tighter">
                                    {user.role === "admin" ? "Admin" : "User"}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* タブナビゲーション */}
                <div className="px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
                    <div className="max-w-2xl mx-auto flex gap-6">
                        {TABS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setActiveTab(value)}
                                className={`py-4 text-sm font-bold transition-all border-b-2 -mb-px ${
                                    activeTab === value
                                        ? "text-blue-600 border-blue-600"
                                        : "text-slate-400 border-transparent hover:text-slate-600"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* コンテンツエリア */}
            <div className="max-w-2xl mx-auto py-10">
                <AnimatePresence mode="wait">
                    {activeTab === "profile" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <form
                                onSubmit={updateProfile}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                            >
                                <div className="p-6 space-y-6">
                                    <Field
                                        label="名前"
                                        error={profileForm.errors.name}
                                    >
                                        <Input
                                            value={profileForm.data.name}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    "name",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="メールアドレス"
                                        error={profileForm.errors.email}
                                    >
                                        <Input
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    "email",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="電話番号"
                                        optional={true}
                                        error={profileForm.errors.phone}
                                    >
                                        <Input
                                            value={profileForm.data.phone}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    "phone",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                </div>
                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                                    <Button disabled={profileForm.processing}>
                                        変更を保存
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {activeTab === "password" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <form
                                onSubmit={updatePassword}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                            >
                                <div className="p-6 space-y-6">
                                    <Field
                                        label="現在のパスワード"
                                        error={
                                            passwordForm.errors.current_password
                                        }
                                    >
                                        <Input
                                            type="password"
                                            value={
                                                passwordForm.data
                                                    .current_password
                                            }
                                            onChange={(e) =>
                                                passwordForm.setData(
                                                    "current_password",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="新しいパスワード"
                                        error={passwordForm.errors.password}
                                    >
                                        <Input
                                            type="password"
                                            value={passwordForm.data.password}
                                            onChange={(e) =>
                                                passwordForm.setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field label="確認用パスワード">
                                        <Input
                                            type="password"
                                            value={
                                                passwordForm.data
                                                    .password_confirmation
                                            }
                                            onChange={(e) =>
                                                passwordForm.setData(
                                                    "password_confirmation",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                </div>
                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                                    <Button disabled={passwordForm.processing}>
                                        パスワードを更新
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AuthenticatedLayout>
    );
}
