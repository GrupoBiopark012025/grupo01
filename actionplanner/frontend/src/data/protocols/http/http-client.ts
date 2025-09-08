import type { HttpRequest } from "@/data/protocols/http/http-request.ts";
import type { HttpResponse } from "@/data/protocols/http/http-response.ts";

export interface HttpClient<R = any> {
  request: (data: HttpRequest) => Promise<HttpResponse<R>>
}
