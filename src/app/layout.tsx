import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KaizenFlow - 業務改革SaaS",
  description: "Diffy & n8nで駆動する業務改善プラットフォーム",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}

function Sidebar() {
  return (
    <nav className="w-60 bg-white border-r border-gray-200 p-4 flex flex-col gap-1">
      <div className="text-xl font-bold text-primary-600 mb-6 px-2">KaizenFlow</div>
      <SidebarLink href="/" label="ダッシュボード" icon="📊" />
      <SidebarLink href="/proposals" label="改善提案" icon="💡" />
      <SidebarLink href="/workflows" label="ワークフロー" icon="⚙️" />
      <SidebarLink href="/diff" label="変更履歴" icon="🔍" />
      <div className="mt-auto pt-4 border-t border-gray-200 text-xs text-gray-400 px-2">
        Powered by Diffy & n8n
      </div>
    </nav>
  );
}

function SidebarLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-700 transition-colors text-sm"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </a>
  );
}
