import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { MENU as STATIC_MENU } from '../utils/menuData'

const MENU_DOC = doc(db, 'config', 'menu')

// Real-time menu listener — falls back to static if not in Firestore
export function useMenu() {
  const [menu, setMenu]     = useState(STATIC_MENU)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(MENU_DOC, snap => {
      if (snap.exists()) {
        setMenu(snap.data().categories || STATIC_MENU)
      } else {
        // First time — seed Firestore with the static menu
        setDoc(MENU_DOC, { categories: STATIC_MENU }).catch(console.error)
        setMenu(STATIC_MENU)
      }
      setLoading(false)
    }, () => {
      setMenu(STATIC_MENU)
      setLoading(false)
    })
    return unsub
  }, [])

  return { menu, loading }
}

// Save full menu back to Firestore
export async function saveMenu(menu) {
  await setDoc(MENU_DOC, { categories: menu })
}
