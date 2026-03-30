import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      if (item) setValue(JSON.parse(item))
    } catch {
      // ignore
    }
  }, [key])

  const setStored = (newValue) => {
    setValue(prev => {
      const next = typeof newValue === 'function' ? newValue(prev) : newValue
      try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }

  return [value, setStored]
}
