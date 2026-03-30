import type { OrderItem, PaymentMethod, BillTotals } from './types';

interface ReceiptParams {
  tableId: number;
  items: OrderItem[];
  totals: BillTotals;
  discountPercent: number;
  paymentMethod: PaymentMethod;
  mobile: string;
}

export function buildReceipt(params: ReceiptParams): string {
  const { tableId, items, totals, discountPercent, paymentMethod, mobile } = params;
  const { subtotal, discountAmount, afterDiscount, gst, total } = totals;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN');
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const billNo = 'RS' + Date.now().toString().slice(-6);

  const pad = (s: string, len: number) => s.padEnd(len).slice(0, len);
  const rpad = (s: string, len: number) => s.padStart(len);

  let r = '';
  r += '================================\n';
  r += '      ROYAL SPICY RESTAURANT    \n';
  r += '   Kondapur Road, Hyderabad     \n';
  r += '      Ph: +91 88979 31711       \n';
  r += '================================\n';
  r += `Bill No : ${billNo}\n`;
  r += `Date    : ${dateStr}  ${timeStr}\n`;
  r += `Table   : T${tableId}\n`;
  r += `Payment : ${paymentMethod}\n`;
  if (mobile) r += `Mobile  : ${mobile}\n`;
  r += '--------------------------------\n';
  r += 'Item                  Qty   Amt \n';
  r += '--------------------------------\n';

  for (const item of items) {
    const name = pad(item.n, 20);
    const qty = rpad(String(item.q), 3);
    const amt = rpad('₹' + (item.p * item.q), 6);
    r += `${name} ${qty} ${amt}\n`;
  }

  r += '--------------------------------\n';
  r += `Subtotal              ${rpad('₹' + subtotal.toFixed(2), 10)}\n`;
  if (discountAmount > 0) {
    r += `Discount (${discountPercent}%)       ${rpad('-₹' + discountAmount.toFixed(2), 10)}\n`;
  }
  r += `After Discount        ${rpad('₹' + afterDiscount.toFixed(2), 10)}\n`;
  r += `GST (5%)              ${rpad('₹' + gst.toFixed(2), 10)}\n`;
  r += '================================\n';
  r += `TOTAL                 ${rpad('₹' + total.toFixed(2), 10)}\n`;
  r += '================================\n';
  r += '   Thank you for dining with us!\n';
  r += '    Please visit again soon :)  \n';
  r += '================================\n';

  return r;
}
