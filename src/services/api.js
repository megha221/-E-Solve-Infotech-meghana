const generateMockBorrowers = () => {
  const names = [
    'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis',
    'David Wilson', 'Jessica Martinez', 'Christopher Anderson', 'Amanda Taylor',
    'Matthew Thomas', 'Ashley Jackson', 'Daniel White', 'Melissa Harris',
    'James Martin', 'Nicole Thompson', 'Robert Garcia', 'Michelle Martinez',
    'William Rodriguez', 'Stephanie Lewis', 'Joseph Lee', 'Rebecca Walker',
    'Charles Hall', 'Laura Allen', 'Thomas Young', 'Kimberly King',
    'Christopher Wright', 'Angela Lopez', 'Daniel Hill', 'Brenda Scott',
    'Mark Green', 'Deborah Adams'
  ]

  const statuses = ['Active', 'Overdue', 'Paid', 'Pending', 'Payment in progress']
  
  return names.map((name, index) => {
    const loanId = `LOAN-${String(index + 1).padStart(4, '0')}`
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const amountDue = Math.floor(Math.random() * 50000) + 5000
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 60) - 30)
    
    return {
      id: index + 1,
      customerName: name,
      loanId,
      status,
      amountDue,
      dueDate: dueDate.toISOString().split('T')[0],
      email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      loanAmount: amountDue + Math.floor(Math.random() * 20000),
      interestRate: (Math.random() * 5 + 3).toFixed(2),
      startDate: new Date(dueDate.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }
  })
}

const mockBorrowers = generateMockBorrowers()

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchBorrowers = async ({ page = 1, limit = 10, search = '', sortBy = '', sortOrder = 'asc' }) => {
  await delay(500)

  let filtered = [...mockBorrowers]

  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(borrower =>
      borrower.customerName.toLowerCase().includes(searchLower) ||
      borrower.loanId.toLowerCase().includes(searchLower) ||
      borrower.status.toLowerCase().includes(searchLower)
    )
  }

  if (sortBy) {
    filtered.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]

      if (sortBy === 'customerName') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginated = filtered.slice(startIndex, endIndex)

  return {
    data: paginated,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  }
}

export const fetchBorrowerById = async (id) => {
  await delay(300)
  const borrower = mockBorrowers.find(b => b.id === parseInt(id))
  if (!borrower) {
    throw new Error('Borrower not found')
  }
  return borrower
}

export const fetchAnalytics = async () => {
  await delay(400)
  
  const total = mockBorrowers.length
  const overdue = mockBorrowers.filter(b => b.status === 'Overdue').length
  const paid = mockBorrowers.filter(b => b.status === 'Paid').length
  const active = mockBorrowers.filter(b => b.status === 'Active').length
  const pending = mockBorrowers.filter(b => b.status === 'Pending').length
  
  const totalRecovered = mockBorrowers
    .filter(b => b.status === 'Paid')
    .reduce((sum, b) => sum + b.amountDue, 0)
  
  const totalDue = mockBorrowers
    .filter(b => b.status !== 'Paid')
    .reduce((sum, b) => sum + b.amountDue, 0)

  const monthlyData = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthName = date.toLocaleString('default', { month: 'short' })
    monthlyData.push({
      month: monthName,
      recovered: Math.floor(Math.random() * 50000) + 20000,
      due: Math.floor(Math.random() * 80000) + 30000,
    })
  }

  return {
    overview: {
      total,
      overdue,
      paid,
      active,
      pending,
      overduePercentage: ((overdue / total) * 100).toFixed(1),
      totalRecovered,
      totalDue,
    },
    monthlyData,
  }
}

