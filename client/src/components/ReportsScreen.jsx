import { usePOS } from '../contexts/POSContext'

export default function ReportsScreen() {
  const { completed, customers, navigateTo } = usePOS()

  const today = new Date().toLocaleDateString()
  const todayOrders = completed.filter(o => o.date === today)
  const todayRev    = todayOrders.reduce((s, o) => s + o.total, 0)
  const avgBill     = todayOrders.length ? todayRev / todayOrders.length : 0
  const todayItems  = todayOrders.reduce((s, o) => s + o.itemCount, 0)
  const totalRev    = completed.reduce((s, o) => s + o.total, 0)
  const custCount   = Object.keys(customers).length

  const sortedCusts = Object.entries(customers)
    .sort(([, a], [, b]) => b.totalSpent - a.totalSpent)

  return (
    <div className="screen active">
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>📊 Reports</h1>
          <p>Sales summary &amp; customer data</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('dashboard')}>
          ← Back
        </button>
      </div>

      <div className="reports-stats">
        {[
          { label: 'Today Revenue',  value: `₹${todayRev.toFixed(0)}` },
          { label: 'Today Orders',   value: todayOrders.length },
          { label: 'Avg Bill',       value: `₹${avgBill.toFixed(0)}` },
          { label: 'Items Sold',     value: todayItems },
          { label: 'Customers',      value: custCount },
          { label: 'Total Revenue',  value: `₹${totalRev.toFixed(0)}` },
        ].map(({ label, value }) => (
          <div key={label} className="stat-card">
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="section-heading">👥 Customer Tracking</div>

      {sortedCusts.length === 0
        ? <p className="empty-state">No customer data yet</p>
        : sortedCusts.map(([mobile, data]) => (
            <div key={mobile} className="customer-row">
              <div>
                <div className="cust-mobile">📱 {mobile}</div>
                <div className="cust-meta">
                  Visits: {data.visits} &nbsp;|&nbsp; Last: {data.lastVisit}
                </div>
              </div>
              <div className="cust-spent">₹{data.totalSpent.toFixed(0)}</div>
            </div>
          ))
      }
    </div>
  )
}
