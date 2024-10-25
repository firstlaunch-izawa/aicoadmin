import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const menuItems = [
  { href: '/', label: 'ダッシュボード' },
  { href: '/conversations', label: '会話ログ' },
  { href: '/clients', label: 'クライアント管理' },
  { href: '/customers', label: 'お客様管理' },
  { href: '/media', label: 'メディア管理' },
  { href: '/triggers', label: 'キーワードトリガー' },
  { href: '/users', label: 'ユーザー管理' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold">
                  Aico Admin
                </Link>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      router.pathname === item.href
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}