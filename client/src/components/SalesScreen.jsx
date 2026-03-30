import { useState, useMemo } from 'react'
import { useSales } from '../hooks/useFirestore'
import { usePOS } from '../contexts/POSContext'

const today = () => new Date().toISOString().split('T')[0]
const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}
const monthStart = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

const FILTERS = [
  { label: 'Today',      start: today(),       end: today() },
  { label: 'Yesterday',  start: daysAgo(1),    end: daysAgo(1) },
  { label: 'Last 7 Days',start: daysAgo(6),    end: today() },
  { label: 'This Month', start: monthStart(),  end: today() },
  { label: 'Custom',     start: null,          end: null },
]

export default function SalesScreen() {
  const { navigateTo } = usePOS()
  const [activeFilter, setActiveFilter] = useState(0)
  const [customStart, setCustomStart]   = useState(daysAgo(30))
  const [customEnd, setCustomEnd]       = useState(today())
  const [payFilter, setPayFilter]       = useState('All')
  const [expandedId, setExpandedId]     = useState(null)

  const f = FILTERS[activeFilter]
  const startDate = activeFilter === 4 ? customStart : f.start
  const endDate   = activeFilter === 4 ? customEnd   : f.end

  const { sales, loading, error } = useSales(startDate, endDate)

  const filtered = useMemo(() => {
    if (payFilter === 'All') return sales
    return sales.filter(s => s.payment === payFilter)
  }, [sales, payFilter])

  // ── Stats ──
  const totalRevenue  = filtered.reduce((s, o) => s + (o.total || 0), 0)
  const totalOrders   = filtered.length
  const avgBill       = totalOrders ? totalRevenue / totalOrders : 0
  const totalItems    = filtered.reduce((s, o) => s + (o.itemCount || 0), 0)
  const cashSales     = filtered.filter(o => o.payment === 'Cash').reduce((s, o) => s + o.total, 0)
  const cardSales     = filtered.filter(o => o.payment === 'Card').reduce((s, o) => s + o.total, 0)
  const upiSales      = filtered.filter(o => o.payment === 'UPI').reduce((s, o) => s + o.total, 0)

  // ── Top Items ──
  const itemMap = {}
  filtered.forEach(order => {
    (order.items || []).forEach(item => {
      if (!itemMap[item.n]) itemMap[item.n] = { qty: 0, revenue: 0 }
      itemMap[item.n].qty     += item.q
      itemMap[item.n].revenue += item.p * item.q
    })
  })
  const topItems = Object.entries(itemMap)
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, 8)

  // ── Daily Breakdown ──
  const dailyMap = {}
  filtered.forEach(order => {
    const d = order.date || ''
    if (!dailyMap[d]) dailyMap[d] = { revenue: 0, orders: 0 }
    dailyMap[d].revenue += order.total || 0
    dailyMap[d].orders  += 1
  })
  const dailyBreakdown = Object.entries(dailyMap)
    .sort(([a], [b]) => b.localeCompare(a))

  const maxDayRev = Math.max(...dailyBreakdown.map(([, v]) => v.revenue), 1)

  return (
    <div className="screen active">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.4rem' }}>📈 Sales Analytics</h1>
          <p>Royal Spicy Restaurant</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('dashboard')}>
          ← Back
        </button>
      </div>

      {/* Date Filter Pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px', flexShrink: 0 }}>
        {FILTERS.map((f, i) => (
          <button
            key={f.label}
            className={`btn btn-sm ${activeFilter === i ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveFilter(i)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Custom date range */}
      {activeFilter === 4 && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexShrink: 0 }}>
          <div className="input-wrap" style={{ flex: 1 }}>
            <label className="input-label">From</label>
            <input className="input-field" type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} />
          </div>
          <div className="input-wrap" style={{ flex: 1 }}>
            <label className="input-label">To</label>
            <input className="input-field" type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
          </div>
        </div>
      )}

      {/* Payment Filter */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexShrink: 0 }}>
        <span className="input-label" style={{ alignSelf: 'center', marginBottom: 0 }}>Payment:</span>
        {['All', 'Cash', 'Card', 'UPI'].map(p => (
          <button
            key={p}
            className={`btn btn-sm ${payFilter === p ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPayFilter(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {loading && <p className="empty-state">Loading sales data...</p>}
      {error   && <p className="empty-state" style={{ color: 'var(--red)' }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          {/* Summary Stats */}
          <div className="reports-stats" style={{ marginBottom: '14px' }}>
            <div className="stat-card">
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">₹{totalRevenue.toFixed(0)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Orders</div>
              <div className="stat-value">{totalOrders}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg Bill</div>
              <div className="stat-value">₹{avgBill.toFixed(0)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Items Sold</div>
              <div className="stat-value">{totalItems}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">💵 Cash</div>
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>₹{cashSales.toFixed(0)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">💳 Card</div>
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>₹{cardSales.toFixed(0)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">📱 UPI</div>
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>₹{upiSales.toFixed(0)}</div>
            </div>
          </div>

          {/* Daily Breakdown Chart */}
          {dailyBreakdown.length > 0 && (
            <div style={{ marginBottom: '16px', flexShrink: 0 }}>
              <div className="section-heading">📅 Daily Breakdown</div>
              <div style={{ background: 'var(--bg2)', borderRadius: '8px', padding: '10px', border: '2px solid var(--border)' }}>
                {dailyBreakdown.map(([date, val]) => (
                  <div key={date} style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 600 }}>{date}</span>
                      <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                        ₹{val.revenue.toFixed(0)} &nbsp;·&nbsp; {val.orders} orders
                      </span>
                    </div>
                    <div style={{ background: 'var(--border)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(val.revenue / maxDayRev) * 100}%`,
                        background: 'linear-gradient(90deg, var(--accent), var(--accent-d))',
                        height: '100%',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Items */}
          {topItems.length > 0 && (
            <div style={{ marginBottom: '16px', flexShrink: 0 }}>
              <div className="section-heading">🔥 Top Selling Items</div>
              <div style={{ background: 'var(--bg2)', borderRadius: '8px', padding: '8px', border: '2px solid var(--border)' }}>
                {topItems.map(([name, data], i) => (
                  <div key={name} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '7px 8px', background: 'white', borderRadius: '6px',
                    marginBottom: '5px', fontSize: '0.82rem',
                    border: i === 0 ? '2px solid var(--accent)' : '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        background: i === 0 ? 'var(--accent)' : 'var(--bg2)',
                        color: i === 0 ? 'white' : 'var(--txt2)',
                        borderRadius: '4px', padding: '1px 6px',
                        fontSize: '0.7rem', fontWeight: 700,
                      }}>#{i + 1}</span>
                      <span style={{ fontWeight: 600 }}>{name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{data.revenue.toFixed(0)}</span>
                      <span style={{ color: 'var(--txt2)', fontSize: '0.72rem', marginLeft: '6px' }}>×{data.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sales History */}
          <div style={{ marginBottom: '16px' }}>
            <div className="section-heading">
              🧾 Sales History
              <span style={{ color: 'var(--txt2)', fontWeight: 400, fontSize: '0.8rem', marginLeft: '8px' }}>
                ({filtered.length} records)
              </span>
            </div>

            {filtered.length === 0
              ? <p className="empty-state">No sales found for this period</p>
              : filtered.map(sale => (
                  <div key={sale.id} style={{
                    background: 'white', border: '1px solid var(--border)',
                    borderRadius: '8px', marginBottom: '8px', overflow: 'hidden',
                  }}>
                    {/* Summary Row */}
                    <div
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '10px 12px', cursor: 'pointer',
                      }}
                      onClick={() => setExpandedId(expandedId === sale.id ? null : sale.id)}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                          {sale.billNo} &nbsp;·&nbsp; Table {sale.table}
                        </div>
                        <div style={{ color: 'var(--txt2)', fontSize: '0.72rem', marginTop: '2px' }}>
                          {sale.date} {sale.time} &nbsp;·&nbsp;
                          {sale.payment} &nbsp;·&nbsp;
                          {sale.itemCount} items
                          {sale.mobile ? ` · 📱 ${sale.mobile}` : ''}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '1rem', fontFamily: 'Poppins,sans-serif' }}>
                          ₹{(sale.total || 0).toFixed(2)}
                        </div>
                        <div style={{ color: 'var(--txt2)', fontSize: '0.7rem' }}>
                          {expandedId === sale.id ? '▲ hide' : '▼ details'}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Items */}
                    {expandedId === sale.id && (
                      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '8px 12px' }}>
                        <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ color: 'var(--txt2)', fontWeight: 700 }}>
                              <th style={{ textAlign: 'left', paddingBottom: '4px' }}>Item</th>
                              <th style={{ textAlign: 'center' }}>Qty</th>
                              <th style={{ textAlign: 'right' }}>Price</th>
                              <th style={{ textAlign: 'right' }}>Amt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(sale.items || []).map((item, i) => (
                              <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                                <td style={{ padding: '4px 0' }}>{item.n}</td>
                                <td style={{ textAlign: 'center' }}>{item.q}</td>
                                <td style={{ textAlign: 'right' }}>₹{item.p}</td>
                                <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{item.p * item.q}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div style={{ borderTop: '2px solid var(--border)', marginTop: '6px', paddingTop: '6px', fontSize: '0.78rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--txt2)' }}>Subtotal</span>
                            <span>₹{(sale.subtotal || 0).toFixed(2)}</span>
                          </div>
                          {(sale.discountAmount > 0) && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--txt2)' }}>Discount ({sale.discount}%)</span>
                              <span style={{ color: 'var(--red)' }}>-₹{(sale.discountAmount || 0).toFixed(2)}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--txt2)' }}>GST (5%)</span>
                            <span>₹{(sale.gst || 0).toFixed(2)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: 'var(--accent)', fontSize: '0.88rem', marginTop: '3px' }}>
                            <span>TOTAL</span>
                            <span>₹{(sale.total || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
            }
          </div>
        </>
      )}
    </div>
  )
}
