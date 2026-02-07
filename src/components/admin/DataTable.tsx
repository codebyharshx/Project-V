'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'

export interface Column<T = any> {
  key: string
  label: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
  className?: string
}

interface DataTableProps<T = any> {
  columns: Column<T>[]
  data: T[]
  searchable?: boolean
  searchPlaceholder?: string
  searchableKeys?: string[]
  actions?: (row: T) => React.ReactNode
  emptyMessage?: string
}

type SortConfig = {
  key: string
  direction: 'asc' | 'desc'
} | null

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchableKeys = [],
  actions,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchTerm || searchableKeys.length === 0) return data

    return data.filter((row) =>
      searchableKeys.some((key) => {
        const value = row[key]
        return value
          ? String(value).toLowerCase().includes(searchTerm.toLowerCase())
          : false
      })
    )
  }, [data, searchTerm, searchableKeys])

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData]

    if (!sortConfig) return sorted

    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()

      if (sortConfig.direction === 'asc') {
        return aStr.localeCompare(bStr)
      } else {
        return bStr.localeCompare(aStr)
      }
    })

    return sorted
  }, [filteredData, sortConfig])

  const handleSort = (key: string) => {
    if (!columns.find((col) => col.key === key)?.sortable) return

    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: 'asc' }
      }
      return prev.direction === 'asc'
        ? { key, direction: 'desc' }
        : null
    })
  }

  return (
    <div className="space-y-4 min-w-0">
      {/* Search Input */}
      {searchable && searchableKeys.length > 0 && (
        <div className="relative min-w-0">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-w-0 pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9D83] focus:border-transparent text-base sm:text-sm"
          />
        </div>
      )}

      {/* Table - horizontal scroll on small screens */}
      <div className="overflow-x-auto -mx-1 px-1 border border-gray-200 rounded-lg min-w-0">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className={`px-3 py-3 sm:px-4 md:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap ${
                    column.sortable
                      ? 'cursor-pointer hover:bg-gray-100 active:bg-gray-100'
                      : ''
                  } ${column.className || ''}`}
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    {column.label}
                    {column.sortable &&
                      sortConfig?.key === column.key && (
                        <>
                          {sortConfig.direction === 'asc' ? (
                            <ChevronUp size={14} className="sm:w-4 sm:h-4" />
                          ) : (
                            <ChevronDown size={14} className="sm:w-4 sm:h-4" />
                          )}
                        </>
                      )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-3 py-3 sm:px-4 md:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-3 py-6 sm:px-6 sm:py-8 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={`${index}-${column.key}`}
                      className={`px-3 py-3 sm:px-4 md:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 ${column.className || ''}`}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-3 py-3 sm:px-4 md:px-6 sm:py-4 text-sm whitespace-nowrap">{actions(row)}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Results Count */}
      {searchable && (
        <p className="text-xs sm:text-sm text-gray-600">
          Showing {sortedData.length} of {data.length} results
        </p>
      )}
    </div>
  )
}
