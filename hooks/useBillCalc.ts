import type { OrderItem, BillTotals } from '@/lib/types';

const GST_RATE = 0.05;

export function useBillCalc(items: OrderItem[], discountPercent: number): BillTotals {
  const subtotal = items.reduce((sum, item) => sum + item.p * item.q, 0);
  const disc = Math.min(100, Math.max(0, discountPercent || 0));
  const discountAmount = subtotal * disc / 100;
  const afterDiscount = subtotal - discountAmount;
  const gst = afterDiscount * GST_RATE;
  const total = afterDiscount + gst;

  return { subtotal, discountAmount, afterDiscount, gst, total };
}
