import { usePOS } from '../contexts/POSContext'

export default function ToastContainer() {
  const { toasts } = usePOS()

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
      ))}
    </div>
  )
}
