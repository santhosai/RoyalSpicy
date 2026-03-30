import { useState, useEffect } from 'react'
import {
  collection, addDoc, query, where,
  orderBy, onSnapshot, serverTimestamp,
  Timestamp, getDocs
} from 'firebase/firestore'
import { db } from '../firebase'

// Save a completed sale to Firestore
export async function saveSale(saleData) {
  try {
    const docRef = await addDoc(collection(db, 'sales'), {
      ...saleData,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (e) {
    console.error('Error saving sale:', e)
    return null
  }
}

// Real-time listener for sales within a date range
export function useSales(startDate, endDate) {
  const [sales, setSales]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!startDate || !endDate) return

    const start = Timestamp.fromDate(new Date(startDate + 'T00:00:00'))
    const end   = Timestamp.fromDate(new Date(endDate   + 'T23:59:59'))

    const q = query(
      collection(db, 'sales'),
      where('createdAt', '>=', start),
      where('createdAt', '<=', end),
      orderBy('createdAt', 'desc')
    )

    const unsub = onSnapshot(q,
      snap => {
        setSales(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      err => { setError(err.message); setLoading(false) }
    )

    return unsub
  }, [startDate, endDate])

  return { sales, loading, error }
}

// One-time fetch for a specific month
export async function fetchMonthlySales(year, month) {
  const start = Timestamp.fromDate(new Date(year, month - 1, 1, 0, 0, 0))
  const end   = Timestamp.fromDate(new Date(year, month, 0, 23, 59, 59))

  const q = query(
    collection(db, 'sales'),
    where('createdAt', '>=', start),
    where('createdAt', '<=', end),
    orderBy('createdAt', 'desc')
  )

  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
