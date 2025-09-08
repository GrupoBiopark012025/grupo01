import { HttpClientAdapter } from "@/infra";

export const makeHttpClientAdapter = (): HttpClientAdapter => new HttpClientAdapter()
