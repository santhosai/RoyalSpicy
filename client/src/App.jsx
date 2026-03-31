import './App.css'
import { POSProvider, usePOS } from './contexts/POSContext'
import { useAuth } from './hooks/useAuth'
import LoginScreen    from './components/LoginScreen'
import Dashboard      from './components/Dashboard'
import OrderScreen    from './components/OrderScreen'
import ReportsScreen  from './components/ReportsScreen'
import SalesScreen    from './components/SalesScreen'
import AdminScreen    from './components/AdminScreen'
import PrintModal     from './components/PrintModal'
import ToastContainer from './components/ToastContainer'

function AppInner() {
  const { activeScreen } = usePOS()

  return (
    <div className="app">
      {activeScreen === 'dashboard' && <Dashboard />}
      {activeScreen === 'orders'    && <OrderScreen />}
      {activeScreen === 'reports'   && <ReportsScreen />}
      {activeScreen === 'sales'     && <SalesScreen />}
      {activeScreen === 'admin'     && <AdminScreen />}
      <PrintModal />
      <ToastContainer />
    </div>
  )
}

function AuthGate() {
  const { admin, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 14, background: '#fff5f0',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff6b35, #e55a25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', fontWeight: 800, color: 'white',
          fontFamily: 'Poppins, sans-serif',
        }}>RS</div>
        <p style={{ color: '#999', fontSize: '0.85rem' }}>Loading...</p>
      </div>
    )
  }

  if (!admin) return <LoginScreen />

  return (
    <POSProvider>
      <AppInner />
    </POSProvider>
  )
}

export default function App() {
  return <AuthGate />
}
