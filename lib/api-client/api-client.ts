import type { ApiErrorCode, ApiErrorResponse } from "@/features/api/types/api-error";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(code: ApiErrorCode, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export const apiFetch = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init);

  if (!response.ok) {
    const body = (await response.json()) as ApiErrorResponse;
    throw new ApiError(body.error.code, body.error.message, response.status);
  }

  return response.json() as Promise<T>;
}
