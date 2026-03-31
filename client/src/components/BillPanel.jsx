import { usePOS } from '../contexts/POSContext'
import { useBillCalc } from '../hooks/useBillCalc'
import BillItemRow from './BillItemRow'
import BillSummary from './BillSummary'

export default function BillPanel({ onSwitchToBill }) {
  const {
    activeTable, orders,
    discountPercent, setDiscountPercent,
    paymentMethod, setPaymentMethod,
    customerMobile, setCustomerMobile,
    openModal, clearTable, showToast, navigateTo,
  } = usePOS()

  const items  = orders[activeTable] || []
  const totals = useBillCalc(items, discountPercent)

  const handlePreview = () => {
    if (items.length === 0) { showToast('Add items first!', 'error'); return }
    openModal()
  }

  const handleClear = () => {
    if (items.length === 0) { navigateTo('dashboard'); return }
    if (window.confirm(`Clear all items from Table ${activeTable}?`)) {
      clearTable(activeTable)
      showToast(`Table ${activeTable} cleared`)
      navigateTo('dashboard')
    }
  }

  return (
    <div className="bill-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div className="bill-title">🧾 Bill — Table {activeTable}</div>
        <span style={{
          background: items.length > 0 ? 'var(--accent)' : 'var(--border)',
          color: 'white', borderRadius: 20, padding: '2px 8px',
          fontSize: '0.7rem', fontWeight: 700,
        }}>
          {items.reduce((s, x) => s + x.q, 0)} items
        </span>
      </div>

      {/* Item List */}
      <div className="bill-items-list">
        {items.length === 0
          ? <p className="empty-state" style={{ padding: 12 }}>No items yet</p>
          : items.map(item => <BillItemRow key={item.n} item={item} />)
        }
      </div>

      <BillSummary totals={totals} />

      {/* Discount */}
      <div className="input-wrap">
        <label className="input-label">Discount %</label>
        <input
          className="input-field"
          type="number"
          min="0" max="100"
          value={discountPercent}
          onChange={e => setDiscountPercent(Number(e.target.value))}
          placeholder="0"
        />
      </div>

      {/* Mobile */}
      <div className="input-wrap">
        <label className="input-label">Customer Mobile (optional)</label>
        <input
          className="input-field"
          type="tel"
          maxLength={10}
          value={customerMobile}
          onChange={e => setCustomerMobile(e.target.value)}
          placeholder="9XXXXXXXXX"
        />
      </div>

      {/* Payment */}
      <div>
        <div className="input-label" style={{ marginBottom: 5 }}>Payment Method</div>
        <div className="pay-methods">
          {[
            { key: 'Cash', icon: '💵' },
            { key: 'Card', icon: '💳' },
            { key: 'UPI',  icon: '📱' },
          ].map(({ key, icon }) => (
            <button
              key={key}
              className={`pay-btn ${paymentMethod === key ? 'selected' : ''}`}
              onClick={() => setPaymentMethod(key)}
            >
              {icon} {key}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <button
        className="btn btn-primary btn-block"
        onClick={handlePreview}
        style={{ fontSize: '0.9rem', padding: '12px' }}
      >
        🖨️ Preview &amp; Print
      </button>
      <button className="btn btn-ghost btn-block btn-sm" onClick={handleClear}>
        🗑 Clear Table
      </button>
    </div>
  )
}
