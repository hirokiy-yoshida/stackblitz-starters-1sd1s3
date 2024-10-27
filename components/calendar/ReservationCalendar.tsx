'use client';

import { useState } from 'react';
import { format, addDays, subDays, startOfDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { ShopSelector } from './ShopSelector';

export default function ReservationCalendar() {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [selectedShopId, setSelectedShopId] = useState<string | null>(
    session?.user?.shopId || null
  );

  const handlePrevDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(startOfDay(date));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1>予約カレンダー</h1>
        {session?.user?.role === 'ADMIN' && (
          <ShopSelector
            selectedShopId={selectedShopId}
            onShopChange={setSelectedShopId}
          />
        )}
      </div>

      <CalendarHeader
        selectedDate={selectedDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onDateChange={handleDateChange}
      />

      <CalendarGrid
        date={selectedDate}
        shopId={selectedShopId || session?.user?.shopId || ''}
      />
    </div>
  );
}