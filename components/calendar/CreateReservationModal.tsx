'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format, addHours } from 'date-fns';
import toast from 'react-hot-toast';

type CreateReservationModalProps = {
  carId: string;
  startTime: Date;
  shopId: string;
  onClose: () => void;
  onSuccess: () => void;
};

type ReservationForm = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

export function CreateReservationModal({
  carId,
  startTime,
  shopId,
  onClose,
  onSuccess
}: CreateReservationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ReservationForm>({
    defaultValues: {
      startDate: format(startTime, 'yyyy-MM-dd'),
      startTime: format(startTime, 'HH:mm'),
      endDate: format(startTime, 'yyyy-MM-dd'),
      endTime: format(addHours(startTime, 1), 'HH:mm')
    }
  });

  const onSubmit = async (data: ReservationForm) => {
    try {
      setIsLoading(true);
      const startDateTime = new Date(`${data.startDate}T${data.startTime}:00`);
      const endDateTime = new Date(`${data.endDate}T${data.endTime}:00`);

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId,
          shopId,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      toast.success('予約を作成しました');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '予約の作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">新規予約</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">開始日時</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                className="input"
                {...register('startDate', { required: '開始日を入力してください' })}
              />
              <input
                type="time"
                step="1800"
                className="input"
                {...register('startTime', { required: '開始時間を入力してください' })}
              />
            </div>
          </div>

          <div>
            <label className="label">終了日時</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                className="input"
                {...register('endDate', { required: '終了日を入力してください' })}
              />
              <input
                type="time"
                step="1800"
                className="input"
                {...register('endTime', { required: '終了時間を入力してください' })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? '作成中...' : '予約を作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}</content>