'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

type CalendarHeaderProps = {
  selectedDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  onDateChange: (date: Date) => void;
};

export function CalendarHeader({
  selectedDate,
  onPrevDay,
  onNextDay,
  onDateChange,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onPrevDay}
        className="btn btn-secondary"
      >
        前日
      </button>

      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-bold m-0">
          {format(selectedDate, 'yyyy年M月d日(E)', { locale: ja })}
        </h2>
        <input
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => onDateChange(new Date(e.target.value))}
          className="input max-w-[150px]"
        />
      </div>

      <button
        onClick={onNextDay}
        className="btn btn-secondary"
      >
        翌日
      </button>
    </div>
  );
}