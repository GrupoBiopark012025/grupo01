import { SectorStatusEnum } from "@data/sector/dtos/sector-status.enum";

export interface PutUpdateSectorDto {
  name: string,
  acronym: string,
  description?: string,
  status: SectorStatusEnum,
  color?: string
}
