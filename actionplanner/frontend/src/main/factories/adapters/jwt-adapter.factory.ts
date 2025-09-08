import type { Decoder } from '@/data/protocols'
import { JwtAdapter } from '@/infra/adapters'

export const makeJwtAdapterFactory = (): Decoder => new JwtAdapter()
