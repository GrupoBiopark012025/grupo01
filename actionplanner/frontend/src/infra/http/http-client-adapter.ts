import { type HttpClient, type HttpRequest, type HttpResponse, HttpStatusCode } from "@/data/protocols";
import axios, { type AxiosError } from "axios";

function mapAxiosErrorToHttpResponse(error: AxiosError): HttpResponse {
  if (error.response) {
    return {
      statusCode: error.response.status,
      body: error.response.data,
    }
  }

  if (error.code === 'ECONNABORTED') {
    return { statusCode: HttpStatusCode.timeout }
  }

  return { statusCode: HttpStatusCode.serviceUnavailable }
}

export class HttpClientAdapter implements HttpClient {
  async request<R = any>(data: HttpRequest): Promise<HttpResponse<R>> {
    try {
      const response = await axios.request<R>({
        url: data.url,
        method: data.method,
        data: data.body,
        params: data.params,
        headers: data.headers,
        timeout: data.timeout,
      })

      return {
        statusCode: response.status,
        body: response.data,
      }
    } catch (e) {
      const error = e as AxiosError
      return mapAxiosErrorToHttpResponse(error)
    }
  }
}