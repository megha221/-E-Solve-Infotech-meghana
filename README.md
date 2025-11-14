# Loan Management Dashboard

A React dashboard for managing loans. Built this to handle borrower data, track loan statuses, and visualize analytics. It's responsive and has dark mode support.

## What's Inside

### Main Pages

**Dashboard**
- Shows all borrowers in a table with pagination
- You can search and sort by customer name or amount due
- Click on any row to see full borrower details

**Analytics**
- Overview cards with key metrics
- Charts showing monthly recovery vs due amounts
- Pie chart for loan status distribution
- Some extra stats thrown in there

**Borrower Modal**
- Shows complete borrower info when you click a row
- Status updates every 3 seconds (just simulated for now)
- Tracks status history with timestamps
- All the loan and payment details you need

### Other Stuff

- Dark mode toggle (because who doesn't love dark mode?)
- Works on mobile and desktop
- Loading states and error handling
- Built with Tailwind CSS

## Tech Stack

- React 18
- React Router for navigation
- React Query (TanStack Query) for data fetching
- Recharts for the charts
- Tailwind CSS for styling
- Vite as the build tool
- Lucide React for icons

## Getting Started

You'll need Node.js (v16+) and npm/yarn.

1. Install dependencies:
```bash
npm install
```

2. Run the dev server:
```bash
npm run dev
```

3. Open `http://localhost:5173` in your browser

### Building for Production

```bash
npm run build
```

Output goes to the `dist` folder.

To preview the production build:
```bash
npm run preview
```

## Project Structure

```
assigmnrt/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          
│   │   ├── DataTable.jsx        
│   │   └── BorrowerModal.jsx    
│   ├── contexts/
│   │   └── ThemeContext.jsx    
│   ├── pages/
│   │   ├── Dashboard.jsx        
│   │   └── Analytics.jsx        
│   ├── services/
│   │   └── api.js               
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## How Things Work

### Dashboard
- Search bar filters by name, loan ID, or status
- Click column headers to sort
- Pagination with 10 items per page
- Click any row to see borrower details

### Analytics
- Overview cards show totals and counts
- Bar chart compares recovered vs due over 6 months
- Pie chart breaks down loan statuses
- Some additional stats below

### Borrower Modal
- Status updates every 3 seconds (simulated)
- Shows full status history
- All customer and loan info in one place
- Color-coded status badges

## About the Data

Right now it's using mock data from `src/services/api.js`. There are 30 sample borrowers with different statuses (Active, Overdue, Paid, Pending, Payment in progress). The amounts and dates are realistic enough for testing.

## Connecting to a Real API

When you're ready to connect to a real backend, just replace the mock functions in `src/services/api.js`. Here's a quick example:

```javascript
export const fetchBorrowers = async ({ page, limit, search, sortBy, sortOrder }) => {
  const response = await fetch(`/api/borrowers?page=${page}&limit=${limit}...`)
  return response.json()
}
```

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (optional, but helpful):
```bash
npm i -g vercel
```

2. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project
   - Build command: `npm run build`
   - Output directory: `dist`
   - Click "Deploy"

3. **Or deploy via CLI:**
```bash
vercel
```

That's it! Your app will be live in seconds.

### Deploy to Netlify

1. **Install Netlify CLI** (optional):
```bash
npm i -g netlify-cli
```

2. **Deploy via Netlify Dashboard:**
   - Go to [netlify.com](https://netlify.com) and sign in with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Or deploy via CLI:**
```bash
netlify deploy --prod
```

Both platforms will automatically deploy on every push to your main branch if you connect your GitHub repo!



