'use client';

import { useEffect, useState } from 'react';
import { format, addMinutes, setHours, setMinutes, isWithinInterval } from 'date-fns';
import { useSession } from 'next-auth/react';
import { Car, Reservation, Maintenance } from '@prisma/client';
import { ReservationSlot } from './ReservationSlot';
import { CreateReservationModal } from './CreateReservationModal';

type TimeSlot = {
  time: Date;
  formatted: string;
};

type CalendarGridProps = {
  date: Date;
  shopId: string;
};

export function CalendarGrid({ date, shopId }: CalendarGridProps) {
  const { data: session } = useSession();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<{
    carId: string;
    startTime: Date;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [carsData, reservationsData, maintenancesData] = await Promise.all([
          fetch(`/api/cars?shopId=${shopId}`).then(res => res.json()),
          fetch(`/api/reservations?date=${format(date, 'yyyy-MM-dd')}&shopId=${shopId}`).then(res => res.json()),
          fetch(`/api/maintenance?date=${format(date, 'yyyy-MM-dd')}&shopId=${shopId}`).then(res => res.json())
        ]);

        setCars(carsData);
        setReservations(reservationsData);
        setMaintenances(maintenancesData);

        const slots: TimeSlot[] = [];
        let currentTime = setMinutes(setHours(date, 9), 0);
        const endTime = setMinutes(setHours(date, 18), 0);

        while (currentTime <= endTime) {
          slots.push({
            time: currentTime,
            formatted: format(currentTime, 'HH:mm')
          });
          currentTime = addMinutes(currentTime, 30);
        }

        setTimeSlots(slots);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchData();
    }
  }, [date, shopId]);

  const getSlotStatus = (carId: string, time: Date) => {
    const reservation = reservations.find(r => 
      r.carId === carId && 
      isWithinInterval(time, { start: r.startTime, end: r.endTime })
    );

    if (reservation) {
      return {
        status: 'reserved',
        data: reservation,
        isOwner: reservation.userId === session?.user?.id
      };
    }

    const maintenance = maintenances.find(m =>
      m.carId === carId &&
      isWithinInterval(time, { start: m.startTime, end: m.endTime })
    );

    if (maintenance) {
      return {
        status: 'maintenance',
        data: maintenance
      };
    }

    return { status: 'available' };
  };

  const handleSlotClick = (carId: string, time: Date) => {
    const status = getSlotStatus(carId, time);
    if (status.status === 'available') {
      setSelectedSlot({ carId, startTime: time });
    }
  };

  const handleCloseModal = () => {
    setSelectedSlot(null);
  };

  const handleReservationCreated = async () => {
    // 予約作成後にデータを再取得
    const [reservationsData] = await Promise.all([
      fetch(`/api/reservations?date=${format(date, 'yyyy-MM-dd')}&shopId=${shopId}`).then(res => res.json()),
    ]);
    setReservations(reservationsData);
    setSelectedSlot(null);
  };

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[150px_1fr] border-t border-l">
            <div className="border-b border-r bg-gray-50 p-2">車両</div>
            <div className="grid grid-cols-[repeat(18,1fr)] border-r">
              {timeSlots.map((slot) => (
                <div
                  key={slot.formatted}
                  className="border-r p-2 text-center text-sm bg-gray-50"
                >
                  {slot.formatted}
                </div>
              ))}
            </div>

            {cars.map((car) => (
              <div key={car.id} className="contents">
                <div className="border-b border-r p-2 bg-white">
                  {car.name}
                </div>
                <div className="grid grid-cols-[repeat(18,1fr)] border-r border-b">
                  {timeSlots.map((slot) => (
                    <ReservationSlot
                      key={`${car.id}-${slot.formatted}`}
                      status={getSlotStatus(car.id, slot.time)}
                      onClick={() => handleSlotClick(car.id, slot.time)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedSlot && (
        <CreateReservationModal
          carId={selectedSlot.carId}
          startTime={selectedSlot.startTime}
          shopId={shopId}
          onClose={handleCloseModal}
          onSuccess={handleReservationCreated}
        />
      )}
    </>
  );
}</content>