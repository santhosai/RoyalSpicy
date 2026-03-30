export interface MenuItem {
  n: string;
  p: number;
}

export interface OrderItem extends MenuItem {
  q: number;
}

export interface CompletedOrder {
  table: number;
  total: number;
  itemCount: number;
  date: string;
  time: string;
  payment: PaymentMethod;
  mobile: string;
  billNo: string;
}

export interface CustomerData {
  visits: number;
  totalSpent: number;
  lastVisit: string;
}

export interface BillTotals {
  subtotal: number;
  discountAmount: number;
  afterDiscount: number;
  gst: number;
  total: number;
}

export type PaymentMethod = 'Cash' | 'Card' | 'UPI';
export type ActiveScreen = 'dashboard' | 'orders' | 'reports';
export type MenuData = Record<string, MenuItem[]>;
