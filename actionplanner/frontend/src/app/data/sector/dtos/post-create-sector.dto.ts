import { SectorStatusEnum } from "@data/sector/dtos/sector-status.enum";

export interface PostCreateSectorDto {
  name: string,
  acronym: string,
  description?: string,
  status: SectorStatusEnum,
  color?: string
}
