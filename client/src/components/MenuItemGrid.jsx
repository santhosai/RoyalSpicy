import { useMenu } from '../hooks/useMenu'
import { usePOS } from '../contexts/POSContext'

export default function MenuItemGrid() {
  const { menu } = useMenu()
  const { selectedCategory, activeTable, addItem, showToast } = usePOS()

  if (!selectedCategory) {
    return (
      <div className="items-grid">
        <p className="empty-state" style={{ gridColumn: '1 / -1' }}>
          👆 Select a category to see items
        </p>
      </div>
    )
  }

  const items = menu[selectedCategory] || []

  const handleAdd = (item) => {
    if (item.available === false) return
    addItem(activeTable, item)
    showToast(`+ ${item.n}`)
  }

  return (
    <div className="items-grid">
      {items.map(item => (
        <button
          key={item.n}
          className={`item-card ${item.available === false ? 'unavailable' : ''}`}
          onClick={() => handleAdd(item)}
          disabled={item.available === false}
        >
          <div className="item-name">{item.n}</div>
          <div className="item-price">₹{item.p}</div>
          {item.available === false && (
            <div style={{ fontSize: '0.6rem', color: 'var(--red)', marginTop: 2 }}>Unavailable</div>
          )}
        </button>
      ))}
    </div>
  )
}
