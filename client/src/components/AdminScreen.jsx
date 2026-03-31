import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useMenu, saveMenu } from '../hooks/useMenu'
import { usePOS } from '../contexts/POSContext'
import { useSales } from '../hooks/useFirestore'

const today = () => new Date().toISOString().split('T')[0]
const monthStart = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

export default function AdminScreen() {
  const { logout, admin } = useAuth()
  const { menu, loading: menuLoading } = useMenu()
  const { navigateTo } = usePOS()
  const [tab, setTab] = useState('menu')
  const [localMenu, setLocalMenu] = useState(null)
  const [expandedCat, setExpandedCat] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newItemName, setNewItemName] = useState({})
  const [newItemPrice, setNewItemPrice] = useState({})
  const [newCatName, setNewCatName] = useState('')

  // Sales for quick stats
  const { sales: todaySales } = useSales(today(), today())
  const { sales: monthSales } = useSales(monthStart(), today())

  useEffect(() => {
    if (menu && !localMenu) setLocalMenu(JSON.parse(JSON.stringify(menu)))
  }, [menu])

  const updatePrice = (cat, idx, val) => {
    const m = { ...localMenu }
    m[cat][idx] = { ...m[cat][idx], p: Number(val) }
    setLocalMenu(m)
  }

  const toggleAvailable = (cat, idx) => {
    const m = { ...localMenu }
    m[cat][idx] = { ...m[cat][idx], available: m[cat][idx].available === false ? true : false }
    setLocalMenu(m)
  }

  const updateName = (cat, idx, val) => {
    const m = { ...localMenu }
    m[cat][idx] = { ...m[cat][idx], n: val }
    setLocalMenu(m)
  }

  const deleteItem = (cat, idx) => {
    if (!window.confirm('Remove this item?')) return
    const m = { ...localMenu }
    m[cat] = m[cat].filter((_, i) => i !== idx)
    setLocalMenu(m)
  }

  const addItem = (cat) => {
    const name  = (newItemName[cat] || '').trim()
    const price = Number(newItemPrice[cat] || 0)
    if (!name || !price) return
    const m = { ...localMenu }
    m[cat] = [...m[cat], { n: name, p: price, available: true }]
    setLocalMenu(m)
    setNewItemName(prev => ({ ...prev, [cat]: '' }))
    setNewItemPrice(prev => ({ ...prev, [cat]: '' }))
  }

  const addCategory = () => {
    const name = newCatName.trim()
    if (!name || localMenu[name]) return
    setLocalMenu(prev => ({ ...prev, [name]: [] }))
    setNewCatName('')
    setExpandedCat(name)
  }

  const deleteCategory = (cat) => {
    if (!window.confirm(`Delete entire category "${cat}"?`)) return
    const m = { ...localMenu }
    delete m[cat]
    setLocalMenu(m)
  }

  const handleSave = async () => {
    setSaving(true)
    await saveMenu(localMenu)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const todayRev   = todaySales.reduce((s, o) => s + o.total, 0)
  const monthRev   = monthSales.reduce((s, o) => s + o.total, 0)
  const todayCount = todaySales.length
  const monthCount = monthSales.length

  return (
    <div className="screen active" style={{ background: '#fafafa' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)' }}>⚙️ Admin Panel</h1>
          <p style={{ fontSize: '0.7rem', color: 'var(--txt2)' }}>
            {admin?.email}
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('dashboard')}>
            🍽️ POS
          </button>
          <button className="btn btn-ghost btn-sm" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="admin-nav">
        {[
          { key: 'menu',    label: '🍽️ Menu Editor' },
          { key: 'stats',   label: '📊 Quick Stats' },
          { key: 'tables',  label: '🪑 Tables Config' },
        ].map(t => (
          <button
            key={t.key}
            className={`admin-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── MENU EDITOR ── */}
      {tab === 'menu' && (
        <div className="menu-editor">
          {/* Save bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'white', border: '2px solid var(--border)', borderRadius: 8,
            padding: '10px 14px', flexShrink: 0, flexWrap: 'wrap', gap: 8,
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--txt2)', fontWeight: 600 }}>
              {menuLoading ? 'Loading menu...' : `${Object.keys(localMenu || {}).length} categories · ${Object.values(localMenu || {}).flat().length} items`}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-green btn-sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : saved ? '✅ Saved!' : '💾 Save Changes'}
              </button>
            </div>
          </div>

          {/* Add Category */}
          <div style={{
            display: 'flex', gap: 6, background: 'white',
            border: '2px solid var(--border)', borderRadius: 8, padding: '10px 12px',
          }}>
            <input
              className="input-field"
              placeholder="New category name (e.g. Special Thali)"
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCategory()}
            />
            <button className="btn btn-primary btn-sm" onClick={addCategory}>+ Add</button>
          </div>

          {/* Category Blocks */}
          {localMenu && Object.entries(localMenu).map(([cat, items]) => (
            <div key={cat} className="category-block">
              <div
                className="category-header"
                onClick={() => setExpandedCat(expandedCat === cat ? null : cat)}
              >
                <h3>
                  {cat}
                  <span style={{
                    marginLeft: 8, fontSize: '0.7rem', color: 'var(--txt2)',
                    fontWeight: 400,
                  }}>
                    ({items.length} items)
                  </span>
                </h3>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={e => { e.stopPropagation(); deleteCategory(cat) }}
                  >
                    🗑
                  </button>
                  <span style={{ color: 'var(--txt2)', fontSize: '0.85rem' }}>
                    {expandedCat === cat ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {expandedCat === cat && (
                <>
                  {/* Column headers */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 80px 36px 32px',
                    gap: 8, padding: '6px 12px',
                    background: 'var(--bg2)',
                    fontSize: '0.65rem', fontWeight: 700,
                    color: 'var(--txt2)', textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>
                    <span>Item Name</span>
                    <span style={{ textAlign: 'right' }}>Price (₹)</span>
                    <span style={{ textAlign: 'center' }}>On</span>
                    <span></span>
                  </div>

                  {items.map((item, idx) => (
                    <div key={idx} className="item-row" style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 80px 36px 32px',
                      gap: 8, alignItems: 'center',
                      opacity: item.available === false ? 0.5 : 1,
                    }}>
                      <input
                        style={{
                          border: 'none', background: 'transparent',
                          fontWeight: 600, fontSize: '0.82rem',
                          fontFamily: 'Roboto, sans-serif', color: 'var(--txt)',
                          width: '100%',
                        }}
                        value={item.n}
                        onChange={e => updateName(cat, idx, e.target.value)}
                      />
                      <input
                        className="price-input"
                        type="number"
                        min="1"
                        value={item.p}
                        onChange={e => updatePrice(cat, idx, e.target.value)}
                      />
                      <button
                        className={`toggle-btn ${item.available !== false ? 'on' : 'off'}`}
                        onClick={() => toggleAvailable(cat, idx)}
                        title={item.available !== false ? 'Available — click to hide' : 'Hidden — click to show'}
                      >
                        <span style={{
                          position: 'absolute', top: 2,
                          left: item.available !== false ? 16 : 2,
                          width: 14, height: 14, borderRadius: '50%',
                          background: 'white', transition: 'left 0.2s',
                        }} />
                      </button>
                      <button
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: '1rem', color: 'var(--red)', padding: '2px',
                        }}
                        onClick={() => deleteItem(cat, idx)}
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* Add Item Row */}
                  <div className="add-item-row">
                    <input
                      className="input-field"
                      placeholder="Item name"
                      value={newItemName[cat] || ''}
                      onChange={e => setNewItemName(prev => ({ ...prev, [cat]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addItem(cat)}
                      style={{ flex: 2 }}
                    />
                    <input
                      className="input-field price-input"
                      type="number"
                      placeholder="₹"
                      value={newItemPrice[cat] || ''}
                      onChange={e => setNewItemPrice(prev => ({ ...prev, [cat]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addItem(cat)}
                      style={{ width: 72 }}
                    />
                    <button className="btn btn-green btn-sm" onClick={() => addItem(cat)}>
                      + Add
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── QUICK STATS ── */}
      {tab === 'stats' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 10, marginBottom: 16,
          }}>
            {[
              { label: "Today's Revenue",  value: `₹${todayRev.toFixed(0)}`,  color: 'var(--accent)' },
              { label: "Today's Orders",   value: todayCount,                  color: 'var(--green)' },
              { label: "Month Revenue",    value: `₹${monthRev.toFixed(0)}`,  color: 'var(--accent)' },
              { label: "Month Orders",     value: monthCount,                  color: 'var(--green)' },
              { label: "Avg Today Bill",   value: `₹${todayCount ? (todayRev / todayCount).toFixed(0) : 0}`, color: '#9b59b6' },
              { label: "Avg Month Bill",   value: `₹${monthCount ? (monthRev / monthCount).toFixed(0) : 0}`, color: '#9b59b6' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ borderColor: s.color }}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Today's orders breakdown */}
          <div className="section-heading">📋 Today's Orders</div>
          {todaySales.length === 0
            ? <p className="empty-state">No orders today yet</p>
            : todaySales.map(s => (
                <div key={s.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'white', border: '1px solid var(--border)', borderRadius: 7,
                  padding: '10px 14px', marginBottom: 6, fontSize: '0.82rem',
                }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{s.billNo} · T{s.table}</div>
                    <div style={{ color: 'var(--txt2)', fontSize: '0.72rem', marginTop: 2 }}>
                      {s.time} · {s.payment} · {s.itemCount} items
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--accent)', fontFamily: 'Poppins, sans-serif' }}>
                    ₹{s.total.toFixed(0)}
                  </div>
                </div>
              ))
          }
        </div>
      )}

      {/* ── TABLES CONFIG ── */}
      {tab === 'tables' && (
        <div>
          <p style={{ fontSize: '0.82rem', color: 'var(--txt2)', marginBottom: 14 }}>
            Currently configured with <strong>12 tables</strong>. Tap a table to rename it.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
              <div key={n} style={{
                background: 'white', border: '2px solid var(--border)',
                borderRadius: 10, padding: '12px 10px', textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent)' }}>
                  Table {n}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--txt2)', marginTop: 4 }}>Active</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--txt2)', marginTop: 14, textAlign: 'center' }}>
            More table configurations coming soon.
          </p>
        </div>
      )}
    </div>
  )
}
