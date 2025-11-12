const PADDED_MONTH_DAY_LENGTH = 2;
const PADDED_YEAR_LENGTH = 4;
const AMERICAN_DATE_PATTERN = /^\d{2}\/\d{2}\/\d{4}$/;

const padNumber = (value: number, length: number) => value.toString().padStart(length, "0");

export const formatAmericanDate = (date: Date) => {
  const month = padNumber(date.getMonth() + 1, PADDED_MONTH_DAY_LENGTH);
  const day = padNumber(date.getDate(), PADDED_MONTH_DAY_LENGTH);
  const year = padNumber(date.getFullYear(), PADDED_YEAR_LENGTH);
  return `${month}/${day}/${year}`;
};

export const isValidAmericanDate = (value: string) => {
  if (!AMERICAN_DATE_PATTERN.test(value)) {
    return false;
  }

  const [monthStr, dayStr, yearStr] = value.split("/");
  const month = Number(monthStr);
  const day = Number(dayStr);
  const year = Number(yearStr);
  if (Number.isNaN(month) || Number.isNaN(day) || Number.isNaN(year)) {
    return false;
  }

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const parsed = new Date(year, month - 1, day);
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
};

export const parseAmericanDate = (value: string) => {
  if (!isValidAmericanDate(value)) {
    return null;
  }

  const [monthStr, dayStr, yearStr] = value.split("/");
  const month = Number(monthStr);
  const day = Number(dayStr);
  const year = Number(yearStr);
  return new Date(year, month - 1, day);
};

export const formatDateToISO = (date: Date) => {
  const month = padNumber(date.getMonth() + 1, PADDED_MONTH_DAY_LENGTH);
  const day = padNumber(date.getDate(), PADDED_MONTH_DAY_LENGTH);
  const year = padNumber(date.getFullYear(), PADDED_YEAR_LENGTH);
  return `${year}-${month}-${day}`;
};

export const americanDateFromISO = (isoValue: string) => {
  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return formatAmericanDate(parsed);
};
