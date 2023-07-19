import { useState, useMemo } from 'react'

type PaginationHook = <T>(
  items: T[],
  itemsPerPage: number,
  initialPage?: number,
) => {
  currentPageData: T[]
  maxPage: number
  canNavigateNext: boolean
  canNavigatePrev: boolean
  nextPage: () => void
  prevPage: () => void
  setPage: (page: number) => void
  currentPage: number
}

export const usePagination: PaginationHook = (items, itemsPerPage, initialPage = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const maxPage = Math.ceil(items.length / itemsPerPage)

  const canNavigateNext = currentPage < maxPage
  const canNavigatePrev = currentPage > 1

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return items.slice(start, end)
  }, [items, currentPage, itemsPerPage])

  const nextPage = () => setCurrentPage((prev) => Math.min(maxPage, prev + 1))

  const prevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1))

  const setPage = (page: number) => setCurrentPage(() => Math.max(1, Math.min(page, maxPage)))

  return {
    currentPageData,
    maxPage,
    canNavigateNext,
    canNavigatePrev,
    nextPage,
    prevPage,
    setPage,
    currentPage,
  }
}
