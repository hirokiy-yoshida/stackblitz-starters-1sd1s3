'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : '';
  };

  const renderNavLinks = () => {
    if (!session?.user) return null;

    const links = [];
    
    // 共通のリンク
    links.push(
      <Link
        key="calendar"
        href="/calendar"
        className={`px-4 py-2 rounded ${isActive('/calendar')}`}
      >
        予約カレンダー
      </Link>
    );

    links.push(
      <Link
        key="reservations"
        href="/reservations"
        className={`px-4 py-2 rounded ${isActive('/reservations')}`}
      >
        予約一覧
      </Link>
    );

    // 店舗管理者用のリンク
    if (session.user.role === 'SHOP_MANAGER') {
      links.push(
        <Link
          key="cars"
          href="/cars"
          className={`px-4 py-2 rounded ${isActive('/cars')}`}
        >
          車両
        </Link>
      );
      links.push(
        <Link
          key="maintenance"
          href="/maintenance"
          className={`px-4 py-2 rounded ${isActive('/maintenance')}`}
        >
          メンテナンス
        </Link>
      );
    }

    // 管理者用のリンク
    if (session.user.role === 'ADMIN') {
      links.push(
        <Link
          key="dashboard"
          href="/admin/dashboard"
          className={`px-4 py-2 rounded ${isActive('/admin/dashboard')}`}
        >
          ダッシュボード
        </Link>
      );
    }

    return links;
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-blue-600 text-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            車両予約システム
          </Link>

          <nav className="flex items-center space-x-4">
            {renderNavLinks()}
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <span>{session.user.name}</span>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 rounded hover:bg-blue-700"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded hover:bg-blue-700"
              >
                ログイン
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}