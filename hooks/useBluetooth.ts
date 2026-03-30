'use client';

import { useState } from 'react';

const SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb';
const CHAR_UUID = '00002af1-0000-1000-8000-00805f9b34fb';

export function useBluetooth() {
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const printReceipt = async (text: string): Promise<boolean> => {
    if (!navigator.bluetooth) {
      setError('Bluetooth not supported in this browser');
      return false;
    }

    setIsPrinting(true);
    setError(null);

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE_UUID] }],
        optionalServices: [SERVICE_UUID],
      });

      const server = await device.gatt!.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      const characteristic = await service.getCharacteristic(CHAR_UUID);

      const encoder = new TextEncoder();

      // ESC/POS init
      await characteristic.writeValue(new Uint8Array([0x1b, 0x40]));

      // Send receipt line by line
      for (const line of text.split('\n')) {
        await characteristic.writeValue(encoder.encode(line + '\n'));
        await new Promise(r => setTimeout(r, 30));
      }

      // Feed + cut
      await characteristic.writeValue(new Uint8Array([0x1b, 0x64, 0x04]));
      await characteristic.writeValue(new Uint8Array([0x1d, 0x56, 0x01]));

      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Bluetooth error';
      setError(msg);
      return false;
    } finally {
      setIsPrinting(false);
    }
  };

  return { printReceipt, isPrinting, error };
}
