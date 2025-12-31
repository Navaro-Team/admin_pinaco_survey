"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"
import { useMemo } from "react"

interface TablePaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  className?: string
  hasMore?: boolean
  onLoadMore?: () => void
  isLoading?: boolean
}

export function TablePagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
  hasMore,
  onLoadMore,
  isLoading = false,
}: TablePaginationProps) {
  const { totalPages, startItem, endItem } = useMemo(() => {
    const total = Math.ceil(totalItems / itemsPerPage)
    const start = (currentPage - 1) * itemsPerPage + 1
    const end = Math.min(currentPage * itemsPerPage, totalItems)
    return {
      totalPages: total,
      startItem: start,
      endItem: end,
    }
  }, [currentPage, totalItems, itemsPerPage])

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (hasMore !== undefined) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      if (hasMore) {
        pages.push("load-more")
      }
      return pages
    }

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }, [currentPage, totalPages, hasMore])

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  if (totalPages <= 0 || totalItems === 0) {
    return null
  }

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t ${className}`}
    >
      <div className="text-sm text-muted-foreground w-full sm:w-auto">
        Hiển thị {startItem} đến {endItem} trong tổng số {totalItems} mục
      </div>
      <Pagination className="w-full sm:w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePrevious}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>
          {pageNumbers.map((page, index) => (
            <PaginationItem key={`${page}-${index}`}>
              {page === "..." ? (
                <span className="flex h-9 w-9 items-center justify-center text-muted-foreground">
                  ...
                </span>
              ) : page === "load-more" ? (
                <PaginationLink
                  onClick={onLoadMore}
                  className="cursor-pointer hover:bg-accent" >
                  ...
                </PaginationLink>
              ) : (
                <PaginationLink
                  onClick={() => handlePageClick(page as number)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={handleNext}
              className={
                currentPage === totalPages || isLoading
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
