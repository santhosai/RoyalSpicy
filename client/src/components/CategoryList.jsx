import { MENU } from '../utils/menuData'
import { usePOS } from '../contexts/POSContext'

export default function CategoryList() {
  const { selectedCategory, setSelectedCategory } = usePOS()

  return (
    <div className="categories-wrap">
      {Object.keys(MENU).map(cat => (
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
