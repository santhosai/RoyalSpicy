import { usePOS } from '../contexts/POSContext'
import { useBillCalc } from '../hooks/useBillCalc'
import { useBluetooth } from '../hooks/useBluetooth'
import { buildReceipt } from '../utils/receiptBuilder'

export default function PrintModal() {
  const {
    isModalOpen, closeModal,
    activeTable, orders,
    discountPercent, paymentMethod, customerMobile,
    clearTable, saveCompletedOrder, trackCustomer,
    navigateTo, showToast,
  } = usePOS()

  const { printReceipt, isPrinting } = useBluetooth()

  const items  = orders[activeTable] || []
  const totals = useBillCalc(items, discountPercent)
  const receipt = isModalOpen
    ? buildReceipt({ tableId: activeTable, items, totals, discountPercent, paymentMethod, mobile: customerMobile })
    : ''

  const handlePrint = async () => {
    const now = new Date()
    const billNo = 'RS' + Date.now().toString().slice(-6)

    // Full order data saved to Firestore
    const order = {
      billNo,
      table:         activeTable,
      items:         items.map(i => ({ n: i.n, p: i.p, q: i.q })),
      subtotal:      totals.subtotal,
      discount:      discountPercent,
      discountAmount: totals.discountAmount,
      afterDiscount: totals.afterDiscount,
      gst:           totals.gst,
      total:         totals.total,
      itemCount:     items.reduce((s, x) => s + x.q, 0),
      payment:       paymentMethod,
      mobile:        customerMobile,
      date:          now.toLocaleDateString('en-IN'),
      time:          now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }

    await saveCompletedOrder(order)
    trackCustomer(customerMobile, totals.total)

    const printed = await printReceipt(receipt)
    showToast(printed ? '✅ Printed & Saved!' : '✅ Saved to Cloud!')

    clearTable(activeTable)
    closeModal()
    navigateTo('dashboard')
  }

  if (!isModalOpen) return null

  return (
    <div className="modal-overlay open">
      <div className="modal-box">
        <div className="modal-title">🧾 Receipt Preview</div>
        <pre className="receipt-pre">{receipt}</pre>
        <button
          className="btn btn-green btn-block"
          style={{ marginBottom: '8px' }}
          onClick={handlePrint}
          disabled={isPrinting}
        >
          {isPrinting ? '🔄 Connecting...' : '🖨️ Confirm & Save'}
        </button>
        <button className="btn btn-secondary btn-block btn-sm" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  )
}
