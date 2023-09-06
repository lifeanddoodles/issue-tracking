export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function addDays(date: Date, days: number) {
  date.setDate(date.getDate() + days);
  return date;
}

export function getFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`;
}
