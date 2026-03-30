import { MENU } from '../utils/menuData'
import { usePOS } from '../contexts/POSContext'

export default function MenuItemGrid() {
  const { selectedCategory, activeTable, addItem, showToast } = usePOS()

  if (!selectedCategory) {
    return (
      <div className="items-grid">
        <p className="empty-state" style={{ gridColumn: '1 / -1' }}>
          Select a category above to see items
        </p>
      </div>
    )
  }

  const items = MENU[selectedCategory] || []

  const handleAdd = (item) => {
    addItem(activeTable, item)
    showToast(`+ ${item.n}`)
  }

  return (
    <div className="items-grid">
      {items.map(item => (
        <button key={item.n} className="item-card" onClick={() => handleAdd(item)}>
          <div className="item-name">{item.n}</div>
          <div className="item-price">₹{item.p}</div>
        </button>
      ))}
    </div>
  )
}
