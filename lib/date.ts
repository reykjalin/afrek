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
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(startMonday);
    d.setDate(d.getDate() + i);
    days.push({
      label: `${dayNames[i]} ${monthNames[d.getMonth()]} ${d.getDate()}`,
      date: toISODateString(d),
      dayName: dayNames[i],
    });
  }

  return days;
}

/**
 * Format a date as ISO date string (YYYY-MM-DD) in local time.
 */
export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse an ISO date string (YYYY-MM-DD) to a Date object in local time.
 * This ensures the date is interpreted as midnight in the user's local timezone,
 * not UTC.
 */
export function parseISODate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format a date for display (e.g., "Mon Jan 23").
 */
export function formatDateLabel(dateString: string): string {
  const date = parseISODate(dateString);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${dayNames[date.getDay()]} ${monthNames[date.getMonth()]} ${date.getDate()}`;
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

/**
 * Parse ISO date string (YYYY-MM-DD) safely without timezone issues.
 * This is a helper for parsing dates that ensures we work in local time.
 */
export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get the week number for a given date (1-53).
 * Week 1 is the week containing January 1st.
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNum;
}

/**
 * Format week range as date string (e.g., "Jan 20 - Jan 26").
 */
export function formatWeekRange(startMonday: Date): string {
  const endOfWeek = new Date(startMonday);
  endOfWeek.setDate(startMonday.getDate() + 6);
  const startMonth = startMonday.toLocaleDateString("en-US", { month: "short" });
  const endMonth = endOfWeek.toLocaleDateString("en-US", { month: "short" });

  if (startMonth === endMonth) {
    return `${startMonth} ${startMonday.getDate()} - ${endOfWeek.getDate()}`;
  }
  return `${startMonth} ${startMonday.getDate()} - ${endMonth} ${endOfWeek.getDate()}`;
}
