'use client';

import { useEffect, useState } from 'react';
import { Shop } from '@prisma/client';

type ShopSelectorProps = {
  selectedShopId: string | null;
  onShopChange: (shopId: string) => void;
};

export function ShopSelector({ selectedShopId, onShopChange }: ShopSelectorProps) {
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch('/api/shops');
        const data = await response.json();
        setShops(data);
      } catch (error) {
        console.error('店舗データの取得に失敗しました:', error);
      }
    };

    fetchShops();
  }, []);

  return (
    <select
      value={selectedShopId || ''}
      onChange={(e) => onShopChange(e.target.value)}
      className="input max-w-xs"
    >
      <option value="">店舗を選択</option>
      {shops.map((shop) => (
        <option key={shop.id} value={shop.id}>
          {shop.name}
        </option>
      ))}
    </select>
  );
}