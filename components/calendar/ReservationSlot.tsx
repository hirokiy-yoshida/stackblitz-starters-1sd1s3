'use client';

import { Reservation, Maintenance } from '@prisma/client';

type SlotStatus = {
  status: 'available' | 'reserved' | 'maintenance';
  data?: Reservation | Maintenance;
  isOwner?: boolean;
};

type ReservationSlotProps = {
  status: SlotStatus;
  onClick: () => void;
};

export function ReservationSlot({ status, onClick }: ReservationSlotProps) {
  const getSlotStyle = () => {
    switch (status.status) {
      case 'reserved':
        return status.isOwner
          ? 'bg-blue-100 hover:bg-blue-200 cursor-pointer'
          : 'bg-red-100';
      case 'maintenance':
        return 'bg-gray-200';
      default:
        return 'hover:bg-gray-100 cursor-pointer';
    }
  };

  return (
    <div
      className={`border-r h-12 relative ${getSlotStyle()}`}
      onClick={onClick}
    />
  );
}</content>