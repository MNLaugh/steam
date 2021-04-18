import { fail, ok } from "./deps.ts";
import type { TResultAsync } from "./deps.ts";

type httpResponse = {
  status: number;
  headers: Headers;
  body?: string | JSON;
};

export const request = async (
  url: string,
  requestInit: RequestInit,
): TResultAsync<httpResponse, Error> => {
  try {
    const result = await fetch(url, requestInit);
    const { status, headers } = result;
    if (status !== 200) {
      const body = (headers.has("content-type"))
      ? (await result.text())
      : void 0;
      return fail(new Error(body))
    } else {
      const contentType = headers.get("content-type");
      const body = (headers.has("content-type") && contentType !== null && contentType.search("json") !== -1)
      ? (await result.json())
      : (await result.text());
      return ok({ status, headers, body });
    }
  } catch (error) {
    return fail(error);
  }
};