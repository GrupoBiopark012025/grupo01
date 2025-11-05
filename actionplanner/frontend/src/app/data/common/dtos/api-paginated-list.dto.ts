export interface ApiPaginatedList<T> {
  data: T[],
  totalPages: number,
  page: number,
  totalData: number,
  currentPage: number,
  size: number
}
