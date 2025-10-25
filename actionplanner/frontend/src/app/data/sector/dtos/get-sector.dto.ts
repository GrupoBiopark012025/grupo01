export interface GetSectorDto {
  id: number,
  name: string,
  acronym: string,
  description: string,
  status: string, // Enum
  color: string,
  createdAt: string,
  updatedAt: string
}
