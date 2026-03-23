export function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function today(): string {
  return toISO(new Date());
}

export function getDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
}

export function isOverdue(dueDate: string): boolean {
  return getDaysOverdue(dueDate) > 0;
}

export function isDueToday(dueDate: string): boolean {
  return dueDate === today();
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function dueDateLabel(dueDate: string): { text: string; className: string } {
  const overdueDays = getDaysOverdue(dueDate);
  if (overdueDays > 7) {
    return {
      text: `${overdueDays}d overdue`,
      className: 'text-red-600 font-semibold',
    };
  }
  if (overdueDays > 0) {
    return {
      text: `${overdueDays}d overdue`,
      className: 'text-red-500 font-medium',
    };
  }
  if (isDueToday(dueDate)) {
    return { text: 'Due Today', className: 'text-amber-600 font-semibold' };
  }
  return { text: formatDate(dueDate), className: 'text-slate-500' };
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function dayOffsetInMonth(dateStr: string, monthStart: Date): number {
  const d = new Date(dateStr + 'T00:00:00');
  return Math.floor(
    (d.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function getMonthStart(year: number, month: number): Date {
  return new Date(year, month, 1);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
