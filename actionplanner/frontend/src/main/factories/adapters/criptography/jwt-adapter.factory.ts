import type { Decoder } from '@/data/protocols'
import { JwtAdapter } from "@/infra";

export const makeJwtAdapterFactory = (): Decoder => new JwtAdapter()
