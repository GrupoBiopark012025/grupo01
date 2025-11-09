import { SectorStatusEnum } from "@data/sector/dtos";

export interface GetSectorDto {
  id: number,
  name: string,
  acronym: string,
  description: string,
  status: SectorStatusEnum,
  color: string,
  createdAt: string,
  updatedAt: string
}
