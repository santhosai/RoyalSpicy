'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type {
  OrderItem, CompletedOrder, CustomerData,
  PaymentMethod, ActiveScreen, MenuItem,
} from '@/lib/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';

interface Toast {
  id: number;
  msg: string;
  type: 'success' | 'error';
}

interface POSContextValue {
  // Navigation
  activeScreen: ActiveScreen;
  activeTable: number | null;
  navigateTo: (screen: ActiveScreen, table?: number) => void;

  // Persisted state
  orders: Record<number, OrderItem[]>;
  completedOrders: CompletedOrder[];
  customers: Record<string, CustomerData>;

  // Order mutations
  addItem: (tableId: number, item: MenuItem) => void;
  changeQty: (tableId: number, itemName: string, delta: number) => void;
  clearTable: (tableId: number) => void;
  clearAllData: () => void;
  saveCompletedOrder: (order: CompletedOrder) => void;
  trackCustomer: (mobile: string, total: number) => void;

  // Order screen state
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  discountPercent: number;
  setDiscountPercent: (d: number) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  customerMobile: string;
  setCustomerMobile: (m: string) => void;

  // Modal
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  // Toast
  toasts: Toast[];
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const POSContext = createContext<POSContextValue | null>(null);

export function POSProvider({ children }: { children: ReactNode }) {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [activeTable, setActiveTable] = useState<number | null>(null);

  const [orders, setOrders] = useLocalStorage<Record<number, OrderItem[]>>(STORAGE_KEYS.ORDERS, {});
  const [completedOrders, setCompleted] = useLocalStorage<CompletedOrder[]>(STORAGE_KEYS.COMPLETED, []);
  const [customers, setCustomers] = useLocalStorage<Record<string, CustomerData>>(STORAGE_KEYS.CUSTOMERS, {});

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [customerMobile, setCustomerMobile] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const navigateTo = useCallback((screen: ActiveScreen, table?: number) => {
    setActiveScreen(screen);
    if (table !== undefined) {
      setActiveTable(table);
      setSelectedCategory(null);
      setDiscountPercent(0);
      setPaymentMethod('Cash');
      setCustomerMobile('');
    }
  }, []);

  const addItem = useCallback((tableId: number, item: MenuItem) => {
    setOrders(prev => {
      const tableItems = [...(prev[tableId] || [])];
      const idx = tableItems.findIndex(x => x.n === item.n);
      if (idx >= 0) tableItems[idx] = { ...tableItems[idx], q: tableItems[idx].q + 1 };
      else tableItems.push({ ...item, q: 1 });
      return { ...prev, [tableId]: tableItems };
    });
  }, [setOrders]);

  const changeQty = useCallback((tableId: number, itemName: string, delta: number) => {
    setOrders(prev => {
      const tableItems = [...(prev[tableId] || [])];
      const idx = tableItems.findIndex(x => x.n === itemName);
      if (idx === -1) return prev;
      const newQty = tableItems[idx].q + delta;
      if (newQty <= 0) tableItems.splice(idx, 1);
      else tableItems[idx] = { ...tableItems[idx], q: newQty };
      const next = { ...prev };
      if (tableItems.length === 0) delete next[tableId];
      else next[tableId] = tableItems;
      return next;
    });
  }, [setOrders]);

  const clearTable = useCallback((tableId: number) => {
    setOrders(prev => {
      const next = { ...prev };
      delete next[tableId];
      return next;
    });
  }, [setOrders]);

  const clearAllData = useCallback(() => {
    setOrders({});
    setCompleted([]);
    setCustomers({});
  }, [setOrders, setCompleted, setCustomers]);

  const saveCompletedOrder = useCallback((order: CompletedOrder) => {
    setCompleted(prev => [...prev, order]);
  }, [setCompleted]);

  const trackCustomer = useCallback((mobile: string, total: number) => {
    if (!mobile || mobile.length < 10) return;
    setCustomers(prev => {
      const existing = prev[mobile] || { visits: 0, totalSpent: 0, lastVisit: '' };
      return {
        ...prev,
        [mobile]: {
          visits: existing.visits + 1,
          totalSpent: existing.totalSpent + total,
          lastVisit: new Date().toLocaleDateString(),
        },
      };
    });
  }, [setCustomers]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2600);
  }, []);

  return (
    <POSContext.Provider value={{
      activeScreen, activeTable, navigateTo,
      orders, completedOrders, customers,
      addItem, changeQty, clearTable, clearAllData, saveCompletedOrder, trackCustomer,
      selectedCategory, setSelectedCategory,
      discountPercent, setDiscountPercent,
      paymentMethod, setPaymentMethod,
      customerMobile, setCustomerMobile,
      isModalOpen, openModal, closeModal,
      toasts, showToast,
    }}>
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const ctx = useContext(POSContext);
  if (!ctx) throw new Error('usePOS must be used inside POSProvider');
  return ctx;
}
