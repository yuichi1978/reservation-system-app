import { useState } from "react";
import { usePage } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { CLINIC_COLORS } from "@/Components/UI";

export default function AuthenticatedLayout({ user, children }) {
    console.log("AuthenticatedLayout_user", user);
    // モバイルメニューの開閉状態
    // Header と AuthenticatedLayout で共有するため、ここで管理します
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // 現在のURL（Header のアクティブリンク判定に使用）
    const { url } = usePage();

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: CLINIC_COLORS.bodyBg }}
        >
            {/* ヘッダー（Components/Header.jsx） */}
            <Header
                user={user}
                currentUrl={url}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />

            {/* メインコンテンツ */}
            {/* flex-1 = フッターを常に最下部に固定するために必要 */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12">
                {children}
            </main>

            {/* フッター（Components/Footer.jsx） */}
            <Footer />
        </div>
    );
}
