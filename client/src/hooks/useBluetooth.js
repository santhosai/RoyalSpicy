import { useState } from 'react'

const SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb'
const CHAR_UUID    = '00002af1-0000-1000-8000-00805f9b34fb'

export function useBluetooth() {
  const [isPrinting, setIsPrinting] = useState(false)

  const printReceipt = async (text) => {
    if (!navigator.bluetooth) return false

    setIsPrinting(true)
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE_UUID] }],
        optionalServices: [SERVICE_UUID],
      })
      const server = await device.gatt.connect()
      const service = await server.getPrimaryService(SERVICE_UUID)
      const char = await service.getCharacteristic(CHAR_UUID)

      const encoder = new TextEncoder()
      await char.writeValue(new Uint8Array([0x1b, 0x40])) // ESC/POS init

      for (const line of text.split('\n')) {
        await char.writeValue(encoder.encode(line + '\n'))
        await new Promise(r => setTimeout(r, 30))
      }

      await char.writeValue(new Uint8Array([0x1b, 0x64, 0x04])) // feed
      await char.writeValue(new Uint8Array([0x1d, 0x56, 0x01])) // cut
      return true
    } catch (e) {
      console.error('Bluetooth error:', e)
      return false
    } finally {
      setIsPrinting(false)
    }
  }

  return { printReceipt, isPrinting }
}
