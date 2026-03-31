import { useState } from 'react'
import { usePOS } from '../contexts/POSContext'
import CategoryList from './CategoryList'
import MenuItemGrid from './MenuItemGrid'
import BillPanel from './BillPanel'

export default function OrderScreen() {
  const { activeTable, orders, navigateTo } = usePOS()
  const [mobileTab, setMobileTab] = useState('menu') // 'menu' | 'bill'

  const itemCount = (orders[activeTable] || []).reduce((s, x) => s + x.q, 0)

  return (
    <div className="screen active">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)' }}>
            🍽️ Table {activeTable}
          </h1>
          <p>Select items to add to order</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('dashboard')}>
          ← Back
        </button>
      </div>

      {/* Mobile Tab Switcher — only visible on small screens via CSS */}
      <div className="order-tabs">
        <button
          className={`order-tab ${mobileTab === 'menu' ? 'active' : ''}`}
          onClick={() => setMobileTab('menu')}
        >
          🍽️ Menu
        </button>
        <button
          className={`order-tab ${mobileTab === 'bill' ? 'active' : ''}`}
          onClick={() => setMobileTab('bill')}
        >
          🧾 Bill
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </button>
      </div>

      {/* Two-panel layout — desktop shows both, mobile hides based on tab */}
      <div className={`orders-layout ${mobileTab === 'menu' ? 'tab-menu' : 'tab-bill'}`}>
        <div className="menu-panel">
          <CategoryList />
          <MenuItemGrid />
        </div>
        <BillPanel onSwitchToBill={() => setMobileTab('bill')} />
      </div>
    </div>
  )
}
