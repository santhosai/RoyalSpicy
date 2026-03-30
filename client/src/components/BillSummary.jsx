export default function BillSummary({ totals }) {
  const { subtotal, discountAmount, afterDiscount, gst, total } = totals

  return (
    <div className="bill-summary">
      <div className="bill-row">
        <span>Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="bill-row">
        <span>Discount</span>
        <span style={{ color: 'var(--red)' }}>-₹{discountAmount.toFixed(2)}</span>
      </div>
      <div className="bill-row">
        <span>After Discount</span>
        <span>₹{afterDiscount.toFixed(2)}</span>
      </div>
      <div className="bill-row">
        <span>GST (5%)</span>
        <span>₹{gst.toFixed(2)}</span>
      </div>
      <div className="bill-row bill-total-row">
        <span>TOTAL</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </div>
  )
}
