import { usePOS } from '../contexts/POSContext'

export default function Dashboard() {
  const { orders, completed, navigateTo, clearAllData } = usePOS()

  const today = new Date().toLocaleDateString()
  const todayCompleted = completed.filter(o => o.date === today)
  const todayRev = todayCompleted.reduce((s, o) => s + o.total, 0)
  const activeRev = Object.values(orders).flat().reduce((s, i) => s + i.p * i.q, 0)
  const totalRev = todayRev + activeRev
  const totalItems = todayCompleted.reduce((s, o) => s + o.itemCount, 0) +
    Object.values(orders).flat().reduce((s, i) => s + i.q, 0)

  const handleClear = () => {
    if (window.confirm('Clear ALL data? This cannot be undone.')) {
      clearAllData()
    }
  }

  return (
    <div className="screen active">
      <div className="page-header">
        <div>
          <h1>ROYAL SPICY</h1>
          <p>Restaurant POS &nbsp;|&nbsp; Kondapur Road, Hyderabad</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('reports')}>
            📊 Reports
          </button>
          <button className="btn btn-ghost btn-sm" onClick={handleClear}>
            🗑 Clear
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Active Orders</div>
          <div className="stat-value">{Object.keys(orders).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Today Revenue</div>
          <div className="stat-value">₹{totalRev.toFixed(0)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Items Sold</div>
          <div className="stat-value">{totalItems}</div>
        </div>
      </div>

      <div className="tables-grid">
        {Array.from({ length: 12 }, (_, i) => i + 1).map(t => {
          const items = orders[t] || []
          const occupied = items.length > 0
          const amt = occupied ? items.reduce((s, x) => s + x.p * x.q, 0) : 0
          return (
            <button
              key={t}
              className={`table-btn ${occupied ? 'occupied' : ''}`}
              onClick={() => navigateTo('orders', t)}
            >
              <span className="t-num">T{t}</span>
              {occupied && <span className="t-amt">₹{amt}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
