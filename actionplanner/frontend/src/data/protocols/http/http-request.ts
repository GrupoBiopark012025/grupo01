import type { HttpMethod } from "@/data/protocols/http/http-method.ts";

export type HttpRequest = {
  url: string
  method: HttpMethod
  body?: any
  params?: Record<string, any>
  headers?: Record<string, string>
  timeout?: number
  timeoutErrorMessage?: string
}
