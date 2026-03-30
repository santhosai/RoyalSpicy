import { usePOS } from '../contexts/POSContext'
import CategoryList from './CategoryList'
import MenuItemGrid from './MenuItemGrid'
import BillPanel from './BillPanel'

export default function OrderScreen() {
  const { activeTable, selectedCategory, navigateTo } = usePOS()

  return (
    <div className="screen active">
      <div className="page-header" style={{ marginBottom: '10px' }}>
        <div>
          <h1 style={{ fontSize: '1.3rem' }}>Table {activeTable}</h1>
          <p>Add items to order</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('dashboard')}>
          ← Back
        </button>
      </div>

      <div className="orders-layout">
        <div className="menu-panel">
          <CategoryList />
          {selectedCategory && (
            <div className="section-title">{selectedCategory}</div>
          )}
          <MenuItemGrid />
        </div>
        <BillPanel />
      </div>
    </div>
  )
}
