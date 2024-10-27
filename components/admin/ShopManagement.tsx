'use client';

import { useState, useEffect } from 'react';
import { Shop } from '@prisma/client';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';

type ShopForm = {
  name: string;
  openTime: string;
  closeTime: string;
};

export function ShopManagement() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ShopForm>();

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    if (editingShop) {
      reset({
        name: editingShop.name,
        openTime: editingShop.openTime,
        closeTime: editingShop.closeTime,
      });
    } else {
      reset({
        name: '',
        openTime: '09:00',
        closeTime: '18:00',
      });
    }
  }, [editingShop, reset]);

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/admin/shops');
      const data = await response.json();
      setShops(data);
    } catch (error) {
      toast.error('店舗情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ShopForm) => {
    try {
      const url = editingShop
        ? `/api/admin/shops/${editingShop.id}`
        : '/api/admin/shops';
      
      const response = await fetch(url, {
        method: editingShop ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error();

      await fetchShops();
      setEditingShop(null);
      reset();
      toast.success(editingShop ? '店舗を更新しました' : '店舗を作成しました');
    } catch (error) {
      toast.error(editingShop ? '店舗の更新に失敗しました' : '店舗の作成に失敗しました');
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">
          {editingShop ? '店舗を編集' : '新規店舗登録'}
        </h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="店舗名"
            id="name"
            error={errors.name?.message}
            {...register('name', { required: '店舗名を入力してください' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="営業開始時間"
              id="openTime"
              type="time"
              error={errors.openTime?.message}
              {...register('openTime', { required: '開始時間を入力してください' })}
            />

            <Input
              label="営業終了時間"
              id="closeTime"
              type="time"
              error={errors.closeTime?.message}
              {...register('closeTime', { required: '終了時間を入力してください' })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            {editingShop && (
              <button
                type="button"
                onClick={() => setEditingShop(null)}
                className="btn btn-secondary"
              >
                キャンセル
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {editingShop ? '更新' : '登録'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">店舗一覧</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  店舗名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  営業時間
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shops.map((shop) => (
                <tr key={shop.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{shop.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {shop.openTime} - {shop.closeTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setEditingShop(shop)}
                      className="text-sm text-blue-600 hover:text-blue-900"
                    >
                      編集
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