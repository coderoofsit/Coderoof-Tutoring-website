const normalizeBaseUrl = (rawBaseUrl: string | undefined): string | undefined => {
  if (typeof rawBaseUrl !== "string") {
    return undefined;
  }

  const trimmed = rawBaseUrl.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed.replace(/\/+$/, "");
};

export const getAppointmentApiUrl = (): string => {
  const baseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

  if (!baseUrl) {
    return "/api/appointments";
  }

  return `${baseUrl}/api/appointments`;
};
