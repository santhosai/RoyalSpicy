import { usePOS } from '../contexts/POSContext'

export default function BillItemRow({ item }) {
  const { activeTable, changeQty } = usePOS()

  return (
    <div className="bill-item">
      <div className="bill-item-row">
        <span className="bill-item-name">{item.n}</span>
        <span className="bill-item-price">₹{(item.p * item.q).toFixed(0)}</span>
      </div>
      <div className="qty-ctrl">
        <button className="qty-btn qty-minus" onClick={() => changeQty(activeTable, item.n, -1)}>−</button>
        <span className="qty-num">{item.q}</span>
        <button className="qty-btn qty-plus" onClick={() => changeQty(activeTable, item.n, 1)}>+</button>
      </div>
    </div>
  )
}
