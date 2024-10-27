'use client';

import { useState, useEffect } from 'react';
import { AllowedDomain } from '@prisma/client';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';

type DomainForm = {
  domain: string;
};

export function DomainManagement() {
  const [domains, setDomains] = useState<AllowedDomain[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DomainForm>();

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/admin/domains');
      const data = await response.json();
      setDomains(data);
    } catch (error) {
      toast.error('ドメイン情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: DomainForm) => {
    try {
      const response = await fetch('/api/admin/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error();

      await fetchDomains();
      reset();
      toast.success('ドメインを追加しました');
    } catch (error) {
      toast.error('ドメインの追加に失敗しました');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('このドメインを削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`/api/admin/domains/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error();

      await fetchDomains();
      toast.success('ドメインを削除しました');
    } catch (error) {
      toast.error('ドメインの削除に失敗しました');
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">許可ドメインの追加</h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="ドメイン"
            id="domain"
            placeholder="example.com"
            error={errors.domain?.message}
            {...register('domain', {
              required: 'ドメインを入力してください',
              pattern: {
                value: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
                message: '有効なドメインを入力してください',
              },
            })}
          />

          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              追加
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">許可ドメイン一覧</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ドメイン
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {domains.map((domain) => (
                <tr key={domain.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{domain.domain}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(domain.id)}
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}