const GST_RATE = 0.05

export function useBillCalc(items, discountPercent) {
  const subtotal = items.reduce((sum, item) => sum + item.p * item.q, 0)
  const disc = Math.min(100, Math.max(0, Number(discountPercent) || 0))
  const discountAmount = subtotal * disc / 100
  const afterDiscount = subtotal - discountAmount
  const gst = afterDiscount * GST_RATE
  const total = afterDiscount + gst

  return { subtotal, discountAmount, afterDiscount, gst, total }
}
