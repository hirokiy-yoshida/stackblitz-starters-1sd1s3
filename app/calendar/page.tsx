import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import ReservationCalendar from '@/components/calendar/ReservationCalendar';

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <ReservationCalendar />;
}