export type JsonResponse<T> = {
  status: number;
  data: T | null,
  message: string
}

type Pagination = {
  page: number,
  per_page: number,
  total_pages: number,
  total: number,
}

export type DataAndPagination <T> = {
  data: JsonResponse<T>,
  pagination: Pagination
}
