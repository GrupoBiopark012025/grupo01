import type { HttpStatusCode } from "@/data/protocols/http/http-status-code.ts";

export type HttpResponse<T = any> = {
  statusCode: HttpStatusCode | number
  body?: T
}
