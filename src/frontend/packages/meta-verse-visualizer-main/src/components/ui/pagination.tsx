import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleFirstPage = () => onPageChange(1)
  const handlePreviousPage = () => onPageChange(Math.max(1, currentPage - 1))
  const handleNextPage = () => onPageChange(Math.min(totalPages, currentPage + 1))
  const handleLastPage = () => onPageChange(totalPages)

  return (
    <div className='flex items-center justify-center space-x-2'>
      <Button
        variant='outline'
        size='icon'
        onClick={handleFirstPage}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className='h-4 w-4' />
      </Button>
      <Button
        variant='outline'
        size='icon'
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>
      <span className='text-sm'>
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant='outline'
        size='icon'
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
      <Button
        variant='outline'
        size='icon'
        onClick={handleLastPage}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className='h-4 w-4' />
      </Button>
    </div>
  )
}
