import { usePOS } from '../contexts/POSContext'
import { useBillCalc } from '../hooks/useBillCalc'
import BillItemRow from './BillItemRow'
import BillSummary from './BillSummary'

export default function BillPanel() {
  const {
    activeTable, orders,
    discountPercent, setDiscountPercent,
    paymentMethod, setPaymentMethod,
    customerMobile, setCustomerMobile,
    openModal, clearTable, showToast, navigateTo,
  } = usePOS()

  const items = orders[activeTable] || []
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
      <div className="bill-title">🧾 Bill — Table {activeTable}</div>

      <div className="bill-items-list">
        {items.length === 0
          ? <p className="empty-state">No items added</p>
          : items.map(item => <BillItemRow key={item.n} item={item} />)
        }
      </div>

      <BillSummary totals={totals} />

      <div className="input-wrap">
        <label className="input-label">Discount %</label>
        <input
          className="input-field"
          type="number"
          min="0"
          max="100"
          value={discountPercent}
          onChange={e => setDiscountPercent(Number(e.target.value))}
          placeholder="0"
        />
      </div>

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

      <div>
        <div className="input-label" style={{ marginBottom: '5px' }}>Payment Method</div>
        <div className="pay-methods">
          {['Cash', 'Card', 'UPI'].map(m => (
            <button
              key={m}
              className={`pay-btn ${paymentMethod === m ? 'selected' : ''}`}
              onClick={() => setPaymentMethod(m)}
            >
              {m === 'Cash' ? '💵' : m === 'Card' ? '💳' : '📱'} {m}
            </button>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-block" onClick={handlePreview}>
        🖨️ Preview &amp; Print
      </button>
      <button className="btn btn-red btn-block btn-sm" onClick={handleClear}>
        🗑 Clear Table
      </button>
    </div>
  )
}
