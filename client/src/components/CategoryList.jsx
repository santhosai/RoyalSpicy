import { useMenu } from '../hooks/useMenu'
import { usePOS } from '../contexts/POSContext'

export default function CategoryList() {
  const { menu, loading } = useMenu()
  const { selectedCategory, setSelectedCategory } = usePOS()

  if (loading) return <div className="empty-state">Loading menu...</div>

  return (
    <div className="categories-wrap">
      {Object.keys(menu).map(cat => (
        <button
          key={cat}
          className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
          onClick={() => setSelectedCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
