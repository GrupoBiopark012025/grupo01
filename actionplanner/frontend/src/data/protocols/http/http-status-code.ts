export const HttpStatusCode = {
  ok: 200,
  created: 201,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  timeout: 408,
  serverError: 500,
  serviceUnavailable: 503,
} as const

export type HttpStatusCode = (typeof HttpStatusCode)[keyof typeof HttpStatusCode]
