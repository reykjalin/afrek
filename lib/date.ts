/**
 * Get the Monday of the week containing the given date.
 */
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get an array of 7 days starting from Monday.
 */
export function getWeekDays(
  startMonday: Date
): { label: string; date: string; dayName: string }[] {
  const days = [];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(startMonday);
    d.setDate(d.getDate() + i);
    days.push({
      label: `${dayNames[i]} ${d.getDate()}`,
      date: toISODateString(d),
      dayName: dayNames[i],
    });
  }

  return days;
}

/**
 * Format a date as ISO date string (YYYY-MM-DD).
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Parse an ISO date string to a Date object.
 */
export function parseISODate(dateString: string): Date {
  return new Date(dateString + "T00:00:00");
}

/**
 * Format a date for display (e.g., "Mon 23").
 */
export function formatDateLabel(dateString: string): string {
  const date = parseISODate(dateString);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${dayNames[date.getDay()]} ${date.getDate()}`;
}

/**
 * Check if a date string is today.
 */
export function isToday(dateString: string): boolean {
  return dateString === toISODateString(new Date());
}

/**
 * Check if two dates are in the same week (Monday-based).
 */
export function isSameWeek(date1: string, date2: string): boolean {
  const week1 = getStartOfWeek(parseISODate(date1));
  const week2 = getStartOfWeek(parseISODate(date2));
  return toISODateString(week1) === toISODateString(week2);
}

/**
 * Get today's date as an ISO string.
 */
export function getTodayString(): string {
  return toISODateString(new Date());
}

/**
 * Get tomorrow's date as an ISO string.
 */
export function getTomorrowString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toISODateString(d);
}
