import { createContext, useContext, useState, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/storageKeys'

const POSContext = createContext(null)

export function POSProvider({ children }) {
  // Navigation
  const [activeScreen, setActiveScreen] = useState('dashboard')
  const [activeTable, setActiveTable] = useState(null)

  // Persisted state
  const [orders, setOrders]         = useLocalStorage(STORAGE_KEYS.ORDERS, {})
  const [completed, setCompleted]   = useLocalStorage(STORAGE_KEYS.COMPLETED, [])
  const [customers, setCustomers]   = useLocalStorage(STORAGE_KEYS.CUSTOMERS, {})

  // Order screen state
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [discountPercent, setDiscountPercent]     = useState(0)
  const [paymentMethod, setPaymentMethod]         = useState('Cash')
  const [customerMobile, setCustomerMobile]       = useState('')

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Toasts
  const [toasts, setToasts] = useState([])

  const navigateTo = useCallback((screen, table) => {
    setActiveScreen(screen)
    if (table !== undefined) {
      setActiveTable(table)
      setSelectedCategory(null)
      setDiscountPercent(0)
      setPaymentMethod('Cash')
      setCustomerMobile('')
    }
  }, [])

  const addItem = useCallback((tableId, item) => {
    setOrders(prev => {
      const list = [...(prev[tableId] || [])]
      const idx = list.findIndex(x => x.n === item.n)
      if (idx >= 0) list[idx] = { ...list[idx], q: list[idx].q + 1 }
      else list.push({ ...item, q: 1 })
      return { ...prev, [tableId]: list }
    })
  }, [setOrders])

  const changeQty = useCallback((tableId, itemName, delta) => {
    setOrders(prev => {
      const list = [...(prev[tableId] || [])]
      const idx = list.findIndex(x => x.n === itemName)
      if (idx === -1) return prev
      const newQty = list[idx].q + delta
      if (newQty <= 0) list.splice(idx, 1)
      else list[idx] = { ...list[idx], q: newQty }
      const next = { ...prev }
      if (list.length === 0) delete next[tableId]
      else next[tableId] = list
      return next
    })
  }, [setOrders])

  const clearTable = useCallback((tableId) => {
    setOrders(prev => {
      const next = { ...prev }
      delete next[tableId]
      return next
    })
  }, [setOrders])

  const clearAllData = useCallback(() => {
    setOrders({})
    setCompleted([])
    setCustomers({})
  }, [setOrders, setCompleted, setCustomers])

  const saveCompletedOrder = useCallback((order) => {
    setCompleted(prev => [...prev, order])
  }, [setCompleted])

  const trackCustomer = useCallback((mobile, total) => {
    if (!mobile || mobile.length < 10) return
    setCustomers(prev => {
      const existing = prev[mobile] || { visits: 0, totalSpent: 0, lastVisit: '' }
      return {
        ...prev,
        [mobile]: {
          visits: existing.visits + 1,
          totalSpent: existing.totalSpent + total,
          lastVisit: new Date().toLocaleDateString(),
        },
      }
    })
  }, [setCustomers])

  const openModal  = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  const showToast = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2600)
  }, [])

  return (
    <POSContext.Provider value={{
      activeScreen, activeTable, navigateTo,
      orders, completed, customers,
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
  )
}

export function usePOS() {
  const ctx = useContext(POSContext)
  if (!ctx) throw new Error('usePOS must be inside POSProvider')
  return ctx
}
