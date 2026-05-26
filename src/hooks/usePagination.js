import { useState } from 'react'

export function usePagination(items, pageSize = 5) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage   = Math.min(page, totalPages)
  const start      = (safePage - 1) * pageSize
  const pageItems  = items.slice(start, start + pageSize)

  return { pageItems, page: safePage, totalPages, setPage }
}