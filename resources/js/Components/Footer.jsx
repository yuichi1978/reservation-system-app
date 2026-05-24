import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { HeartbeatIcon } from "@/Components/Icons";

export default function Footer() {
    const footerLinks = [
        { href: route("reservations.create"), label: "新規予約" },
        { href: route("reservations.index"), label: "予約一覧" },
        { href: route("profile.edit"), label: "プロフィール" },
    ];

    return (
        <footer
            className="mt-12 p-8"
            style={{
                backgroundColor: "#0a1628",
                borderTop: "1px solid #1e2d45",
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* ロゴ + コピーライト */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2"
                    >
                        <div
                            className="w-5 h-5 rounded flex items-center justify-center"
                            style={{ backgroundColor: "#1a6bb5" }}
                        >
                            <HeartbeatIcon size={11} color="white" />
                        </div>
                        <span className="text-xs" style={{ color: "#3d5975" }}>
                            © {new Date().getFullYear()} メディカル予約システム
                        </span>
                    </motion.div>

                    {/* フッターリンク */}
                    <motion.nav
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        viewport={{ once: true }}
                        className="flex items-center gap-5"
                    >
                        {footerLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="text-xs transition-colors"
                                style={{ color: "#3d5975" }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = "#8ba8c8";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = "#3d5975";
                                }}
                            >
                                {label}
                            </Link>
                        ))}
                    </motion.nav>
                </div>
            </div>
        </footer>
    );
}
