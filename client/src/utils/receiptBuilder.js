// NOTE: Use "Rs." instead of "₹" — thermal printers don't support UTF-8 rupee symbol

export function buildReceipt({ tableId, items, totals, discountPercent, paymentMethod, mobile }) {
  const { subtotal, discountAmount, afterDiscount, gst, total } = totals

  const now     = new Date()
  const dateStr = now.toLocaleDateString('en-IN')
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const billNo  = 'RS' + Date.now().toString().slice(-6)

  // Rounded total
  const rounded     = Math.round(total)
  const roundedDiff = (rounded - total).toFixed(2)

  // GST split
  const cgst = (gst / 2).toFixed(2)
  const sgst = (gst / 2).toFixed(2)

  // Width = 32 chars (fits 58mm and 80mm printers)
  const W = 32

  const LINE  = '-'.repeat(W)
  const DLINE = '='.repeat(W)

  // Right-pad string to length
  const rp = (s, n) => String(s).padEnd(n).slice(0, n)
  // Left-pad string to length
  const lp = (s, n) => String(s).padStart(n).slice(-n)
  // Center a string
  const center = (s, n = W) => {
    const str = String(s)
    const pad = Math.max(0, Math.floor((n - str.length) / 2))
    return ' '.repeat(pad) + str
  }

  // Format a bill row: label left, value right
  const row = (label, value, width = W) => {
    const val = String(value)
    const lbl = String(label).padEnd(width - val.length).slice(0, width - val.length)
    return lbl + val
  }

  let r = ''
  r += DLINE + '\n'
  r += center('ROYAL SPICY RESTAURANT') + '\n'
  r += center('Kondapur Road, Hyderabad') + '\n'
  r += center('Ph: +91 88979 31711') + '\n'
  r += center('GSTIN: 36XXXXX0000X1ZX') + '\n'
  r += DLINE + '\n'
  r += `Bill No : ${billNo}\n`
  r += `Date    : ${dateStr}  ${timeStr}\n`
  r += `Table   : T${tableId}\n`
  r += `Payment : ${paymentMethod}\n`
  if (mobile) r += `Mobile  : ${mobile}\n`
  r += LINE + '\n'

  // Header: ITEM(16) QTY(3) RATE(6) AMT(7) = 32
  r += rp('ITEM', 16) + lp('QTY', 3) + lp('RATE', 6) + lp('AMT', 7) + '\n'
  r += LINE + '\n'

  for (const item of items) {
    const name  = item.n
    const qty   = item.q
    const rate  = item.p
    const amt   = item.p * item.q

    // If name > 16 chars, print on first line then qty/rate/amt on second
    if (name.length <= 16) {
      r += rp(name, 16) + lp(qty, 3) + lp(rate, 6) + lp(amt, 7) + '\n'
    } else {
      // Long name: wrap
      r += rp(name.slice(0, 16), 16) + lp(qty, 3) + lp(rate, 6) + lp(amt, 7) + '\n'
      if (name.length > 16) {
        r += rp(name.slice(16, 30), 30) + '\n'
      }
    }
  }

  r += LINE + '\n'
  r += row('Subtotal', 'Rs.' + subtotal.toFixed(2)) + '\n'

  if (discountAmount > 0) {
    r += row(`Discount (${discountPercent}%)`, '-Rs.' + discountAmount.toFixed(2)) + '\n'
    r += row('After Discount', 'Rs.' + afterDiscount.toFixed(2)) + '\n'
  }

  r += row('CGST (2.5%)', 'Rs.' + cgst) + '\n'
  r += row('SGST (2.5%)', 'Rs.' + sgst) + '\n'

  if (Math.abs(rounded - total) > 0) {
    r += row('Rounded Off', (parseFloat(roundedDiff) >= 0 ? '+' : '') + roundedDiff) + '\n'
  }

  r += DLINE + '\n'
  r += row('GRAND TOTAL', 'Rs.' + rounded.toFixed(2)) + '\n'
  r += DLINE + '\n'
  r += center('Thank you for dining with us!') + '\n'
  r += center('Please visit again soon :)') + '\n'
  r += DLINE + '\n'

  return r
}
