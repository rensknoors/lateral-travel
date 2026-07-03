export type ApiErrorCode = "bad-request" | "not-found" | "unavailable";

export type ApiErrorResponse = {
  error: {
    code: ApiErrorCode;
    message: string;
  };
};
