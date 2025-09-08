import { jwtDecode } from 'jwt-decode'
import { InvalidParamsError, UnexpectedError } from '@/domain/errors'
import type { Decoder } from '@/data/protocols'

export class JwtAdapter implements Decoder {
  decode (token: string): any {
    if (!token) {
      throw new InvalidParamsError('Token inválido')
    }

    try {
      const plaintext: any = jwtDecode(token)
      return plaintext
    } catch (error) {
      throw new UnexpectedError('Erro ao decodificar token')
    }
  }
}
