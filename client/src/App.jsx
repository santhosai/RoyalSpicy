import './App.css'
import { POSProvider, usePOS } from './contexts/POSContext'
import Dashboard from './components/Dashboard'
import OrderScreen from './components/OrderScreen'
import ReportsScreen from './components/ReportsScreen'
import SalesScreen from './components/SalesScreen'
import PrintModal from './components/PrintModal'
import ToastContainer from './components/ToastContainer'

function AppInner() {
  const { activeScreen } = usePOS()

  return (
    <div className="app">
      {activeScreen === 'dashboard' && <Dashboard />}
      {activeScreen === 'orders'    && <OrderScreen />}
      {activeScreen === 'reports'   && <ReportsScreen />}
      {activeScreen === 'sales'     && <SalesScreen />}
      <PrintModal />
      <ToastContainer />
    </div>
  )
}

export default function App() {
  return (
    <POSProvider>
      <AppInner />
    </POSProvider>
  )
}
