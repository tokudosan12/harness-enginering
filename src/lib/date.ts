import { differenceInCalendarDays, format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function getDaysRemaining(deadline: string): number {
  return differenceInCalendarDays(new Date(deadline), new Date());
}

export function formatDate(date: string): string {
  return format(new Date(date), 'dd/MM/yyyy', { locale: vi });
}

export function formatRelativeDays(deadline: string): string {
  const days = getDaysRemaining(deadline);
  if (days < 0) return 'Đã hết hạn';
  if (days === 0) return 'Hết hạn hôm nay';
  return `Còn ${days} ngày`;
}
