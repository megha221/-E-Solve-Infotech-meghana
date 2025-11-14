import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchBorrowerById } from '../services/api'
import { X, Loader2, Phone, Mail, Calendar, DollarSign, Percent, Clock } from 'lucide-react'

const BorrowerModal = ({ borrowerId, isOpen, onClose }) => {
  const [statusHistory, setStatusHistory] = useState([])
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0)

  const statusSequence = [
    'Pending',
    'Payment in progress',
    'Active',
    'Payment in progress',
    'Paid',
  ]

  const { data: borrower, isLoading, isError } = useQuery({
    queryKey: ['borrower', borrowerId],
    queryFn: () => fetchBorrowerById(borrowerId),
    enabled: isOpen && !!borrowerId,
  })

  useEffect(() => {
    if (!isOpen || !borrower) return

    const interval = setInterval(() => {
      setCurrentStatusIndex((prev) => {
        const next = (prev + 1) % statusSequence.length
        const newStatus = statusSequence[next]
        setStatusHistory((history) => [
          ...history,
          {
            status: newStatus,
            timestamp: new Date().toLocaleTimeString(),
          },
        ])
        return next
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isOpen, borrower])

  if (!isOpen) return null

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      Paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'Payment in progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    }

    return (
      <span
        className={`px-3 py-1 text-sm font-semibold rounded-full ${
          statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }`}
      >
        {status}
      </span>
    )
  }

  const currentStatus = statusHistory.length > 0
    ? statusHistory[statusHistory.length - 1].status
    : borrower?.status

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-opacity-90"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {isLoading ? (
            <div className="p-8 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : isError ? (
            <div className="p-8">
              <p className="text-red-600 dark:text-red-400">Error loading borrower details</p>
            </div>
          ) : borrower ? (
            <>
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Borrower Details
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {borrower.customerName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {borrower.customerName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span>{borrower.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>{borrower.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                    Loan Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Loan Amount</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(borrower.loanAmount)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Amount Due</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(borrower.amountDue)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Percent className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Interest Rate</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {borrower.interestRate}%
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Start Date</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatDate(borrower.startDate)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Due Date</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatDate(borrower.dueDate)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Loan ID</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {borrower.loanId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-500 animate-pulse" />
                    Real-time Status
                  </h4>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Current Status:</span>
                      {getStatusBadge(currentStatus)}
                    </div>
                  </div>
                  {statusHistory.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Status History:</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {statusHistory.slice(-5).reverse().map((entry, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-700/50 rounded px-3 py-2"
                          >
                            <span className="text-gray-600 dark:text-gray-400">{entry.status}</span>
                            <span className="text-gray-500 dark:text-gray-500">{entry.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default BorrowerModal

