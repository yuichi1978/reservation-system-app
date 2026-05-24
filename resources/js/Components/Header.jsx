import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    HeartbeatIcon,
    ChevronDownIcon,
    MenuIcon,
    CloseIcon,
} from "@/Components/Icons";

export default function Header({
    user,
    currentUrl,
    mobileMenuOpen,
    setMobileMenuOpen,
}) {
    // アバターのイニシャル
    const initials = user?.name ? user.name.charAt(0).toUpperCase() : "?";

    // ナビゲーションリンク定義
    const navLinks = [
        { href: route("dashboard"), label: "ダッシュボード" },
        { href: route("reservations.index"), label: "予約一覧" },
        { href: route("reservations.create"), label: "新規予約" },
    ];

    // アクティブリンクの判定
    const isActive = (href) => {
        const path = href.includes("://") ? new URL(href).pathname : href;
        return currentUrl.startsWith(path);
    };

    return (
        <header
            className="sticky top-0 z-50 mb-12"
            style={{
                backgroundColor: "#0a1628",
                borderBottom: "1px solid #1e2d45",
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Logo />

                    <DesktopNav
                        navLinks={navLinks}
                        isActive={isActive}
                        isAdmin={user?.role === "admin"}
                    />

                    <div className="flex items-center gap-2">
                        <UserMenu user={user} initials={initials} />

                        <button
                            className="md:hidden p-2 rounded-md transition-colors"
                            style={{ color: "#8ba8c8" }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <CloseIcon size={20} color="#8ba8c8" />
                            ) : (
                                <MenuIcon size={20} color="#8ba8c8" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <MobileMenu
                navLinks={navLinks}
                isActive={isActive}
                isAdmin={user?.role === "admin"}
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            />
        </header>
    );
}

function Logo() {
    return (
        <Link href={route("dashboard")} className="flex items-center gap-2.5">
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#1a6bb5" }}
            >
                <HeartbeatIcon size={18} color="white" />
            </motion.div>
            <div className="hidden sm:flex flex-col leading-none">
                <span className="font-semibold text-sm text-white">
                    メディカル予約
                </span>
                <span style={{ color: "#5b87b8", fontSize: "10px" }}>
                    Clinic Reservation
                </span>
            </div>
        </Link>
    );
}

function DesktopNav({ navLinks, isActive, isAdmin }) {
    return (
        <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
                <Link
                    key={href}
                    href={href}
                    className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
                    style={
                        isActive(href)
                            ? { backgroundColor: "#1a3a5c", color: "#60a5fa" }
                            : { color: "#8ba8c8" }
                    }
                >
                    {label}
                </Link>
            ))}
            {isAdmin && (
                <Link
                    href={route("admin.dashboard")}
                    className="px-3.5 py-2 rounded-lg text-sm font-medium text-[#34d399]"
                >
                    管理画面
                </Link>
            )}
        </nav>
    );
}

function UserMenu({ user, initials }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border outline-none"
                    style={{ borderColor: "#1e2d45" }}
                >
                    <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: "#1a6bb5" }}
                    >
                        {initials}
                    </div>
                    <span className="hidden sm:block text-sm text-[#c5d8ee]">
                        {user?.name}
                    </span>
                    <ChevronDownIcon size={14} color="#5b87b8" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-48 bg-[#0a1628] border-[#1e2d45] text-[#c5d8ee]"
            >
                <DropdownMenuLabel className="text-xs">
                    マイアカウント
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#1e2d45]" />
                <DropdownMenuItem className="cursor-pointer">
                    <Link href={route("profile.edit")} className="w-full">
                        プロフィール設定
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-400">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full text-left"
                    >
                        ログアウト
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function MobileMenu({ navLinks, isActive, isAdmin, isOpen, onClose }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden border-t border-[#1e2d45] bg-[#0a1628]"
                >
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={onClose}
                                className="block px-4 py-3 rounded-lg text-base font-medium"
                                style={
                                    isActive(href)
                                        ? {
                                              backgroundColor: "#1a3a5c",
                                              color: "#60a5fa",
                                          }
                                        : { color: "#8ba8c8" }
                                }
                            >
                                {label}
                            </Link>
                        ))}
                        {isAdmin && (
                            <Link
                                href={route("admin.dashboard")}
                                onClick={onClose}
                                className="block px-4 py-3 text-[#34d399] font-medium"
                            >
                                管理画面
                            </Link>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
