/**
 * Date and time helper utilities
 */

/**
 * Get day name from day number (0 = Sunday)
 */
export const getDayName = (day: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day] || '';
};

/**
 * Get short day name from day number (0 = Sunday)
 */
export const getShortDayName = (day: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[day] || '';
};

/**
 * Format time string to 12-hour format
 */
export const formatTimeTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Check if a medication should be taken today
 */
export const isTodayScheduled = (daysOfWeek: number[]): boolean => {
  const today = new Date().getDay();
  return daysOfWeek.includes(today);
};

/**
 * Get next scheduled time for a medication
 */
export const getNextScheduledTime = (time: string, daysOfWeek: number[]): Date | null => {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  
  // Try today first
  const today = new Date();
  today.setHours(hours, minutes, 0, 0);
  
  if (daysOfWeek.includes(now.getDay()) && today > now) {
    return today;
  }
  
  // Find next day in schedule
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + i);
    nextDate.setHours(hours, minutes, 0, 0);
    
    if (daysOfWeek.includes(nextDate.getDay())) {
      return nextDate;
    }
  }
  
  return null;
};

