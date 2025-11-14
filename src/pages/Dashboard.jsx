import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchBorrowers } from '../services/api'
import DataTable from '../components/DataTable'
import BorrowerModal from '../components/BorrowerModal'
import { Search, Loader2 } from 'lucide-react'

const Dashboard = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedBorrower, setSelectedBorrower] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['borrowers', page, search, sortBy, sortOrder],
    queryFn: () => fetchBorrowers({ page, limit: 10, search, sortBy, sortOrder }),
  })

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleRowClick = (borrower) => {
    setSelectedBorrower(borrower)
    setIsModalOpen(true)
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Loan Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all loan accounts
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, loan ID, or status..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">
            Error loading data: {error?.message || 'Unknown error'}
          </p>
        </div>
      ) : (
        <DataTable
          data={data?.data || []}
          total={data?.total || 0}
          page={page}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onRowClick={handleRowClick}
        />
      )}

      {isModalOpen && selectedBorrower && (
        <BorrowerModal
          borrowerId={selectedBorrower.id}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedBorrower(null)
          }}
        />
      )}
    </div>
  )
}

export default Dashboard

