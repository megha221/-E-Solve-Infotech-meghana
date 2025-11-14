import { useQuery } from '@tanstack/react-query'
import { fetchAnalytics } from '../services/api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Loader2, TrendingUp, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'

const Analytics = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']

  const statusData = data?.overview
    ? [
        { name: 'Active', value: data.overview.active },
        { name: 'Overdue', value: data.overview.overdue },
        { name: 'Paid', value: data.overview.paid },
        { name: 'Pending', value: data.overview.pending },
      ]
    : []

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">
          Error loading analytics: {error?.message || 'Unknown error'}
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Key metrics and insights for loan management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Loans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {data?.overview.total || 0}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overdue Accounts</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                {data?.overview.overdue || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {data?.overview.overduePercentage || 0}% of total
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-3">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Recovered</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {formatCurrency(data?.overview.totalRecovered || 0)}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Due</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                {formatCurrency(data?.overview.totalDue || 0)}
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-3">
              <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Recovery vs Due Amount
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                className="dark:text-gray-400"
              />
              <YAxis
                stroke="#6b7280"
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey="recovered" fill="#10b981" name="Recovered" />
              <Bar dataKey="due" fill="#ef4444" name="Due" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Loan Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Additional Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data?.overview.active || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Loans</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data?.overview.paid || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Paid Loans</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {data?.overview.pending || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending Loans</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {data?.overview.overdue || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Overdue Loans</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics

