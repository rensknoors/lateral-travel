import { HttpResponse } from "msw";

export const notFound = (message: string) =>
  HttpResponse.json(
    { error: { code: "not-found", message } },
    { status: 404 },
  );
