'use client';

import { useState } from 'react';
import { UserManagement } from './UserManagement';
import { ShopManagement } from './ShopManagement';
import { DomainManagement } from './DomainManagement';

type Tab = 'users' | 'shops' | 'domains';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('users');

  const tabs = [
    { id: 'users' as Tab, label: 'ユーザー管理' },
    { id: 'shops' as Tab, label: '店舗管理' },
    { id: 'domains' as Tab, label: 'ドメイン管理' },
  ];

  return (
    <div className="space-y-6">
      <h1>管理者ダッシュボード</h1>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'shops' && <ShopManagement />}
        {activeTab === 'domains' && <DomainManagement />}
      </div>
    </div>
  );
}