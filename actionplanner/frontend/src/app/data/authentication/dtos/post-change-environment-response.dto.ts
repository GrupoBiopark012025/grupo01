import { UserClientDto } from "@data/user/dtos";

export interface PostChangeEnvironmentResponseDto {
  token: string;
  cliente: UserClientDto;
}
