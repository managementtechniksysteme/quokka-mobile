export const correctTimezoneOffset = (data: Date): Date => {
  return new Date(data.getTime() - data.getTimezoneOffset() * 60 * 1000);
};

export const apiDate = (date: Date) => {
  return correctTimezoneOffset(date).toISOString().substring(0, 10);
};

export const apiTime = (date: Date): string => {
  return correctTimezoneOffset(date).toISOString().substring(11, 16);
};

export const hourlyDurationFitsInInterval = (
  hours: number,
  start: Date,
  end: Date,
  minDurationInterval: number
): boolean => {
  start = new Date(start.setSeconds(0));
  end = new Date(end.setSeconds(0));
  const minDurationMinutes = minDurationInterval * 60;
  const diffMinutes = (end.getTime() - start.getTime()) / 1000 / 60;
  const maxDiffMinutes = diffMinutes - (diffMinutes % minDurationMinutes);
  const maxHours = maxDiffMinutes / 60;

  return hours <= maxHours;
};
