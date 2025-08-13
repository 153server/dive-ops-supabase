import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { BrowserMultiFormatReader } from '@zxing/browser'

type Cyl = { id:string; label?:string|null; status:string }

export default function ScanPage() {
  const [scanActive, setScanActive] = useState(false)
  const [scanError, setScanError] = useState<string>('')
  const [scanMessage, setScanMessage] = useState<string>('')
  const [manualCode, setManualCode] = useState<string>('')

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const zxingControlsRef = useRef<{ stop: () => void } | null>(null)
  const lastCodeRef = useRef<string>('')

  useEffect(() => {
    return () => { stopScan(true) } // cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function startScan() {
    setScanError('')
    setScanMessage('')

    const el = videoRef.current
    if (!el) { setScanError('Video element not ready'); return }

    // iOS friendly video attributes
    el.setAttribute('playsinline','true')
    el.muted = true
    el.autoplay = true

    // Fast path: native BarcodeDetector (Chrome/Android)
    if ('BarcodeDetector' in window) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        })
        el.srcObject = stream
        await el.play()

        // @ts-ignore - BarcodeDetector exists at runtime in supported browsers
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
        setScanActive(true)

        const loop = async () => {
          try {
            const codes = await detector.detect(el)
            if (codes?.length) {
              const code = codes[0].rawValue || ''
              if (code && code !== lastCodeRef.current) {
                lastCodeRef.current = code
                await handleScanCode(code)
              }
            }
          } catch { /* ignore frame errors */ }
          if (scanActive) rafIdRef.current = requestAnimationFrame(loop)
        }
        rafIdRef.current = requestAnimationFrame(loop)
        return
      } catch (e:any) {
        console.warn('BarcodeDetector failed, falling back to ZXing:', e?.message)
        await stopScan(true) // clear any half-open resources, then fall through
      }
    }

    // Fallback: ZXing (works on iOS Safari)
    try {
      const reader = new BrowserMultiFormatReader()
      const devices = await BrowserMultiFormatReader.listVideoInputDevices()
      if (!devices.length) { setScanError('No camera found'); return }
      const deviceId = devices[0].deviceId

      const controls = await reader.decodeFromVideoDevice(deviceId, el, async (result, err) => {
        if (result) {
          const text = result.getText()
          if (text && text !== lastCodeRef.current) {
            lastCodeRef.current = text
            await handleScanCode(text)
          }
        }
        // ignore transient decode errors
      })

      zxingControlsRef.current = controls
      setScanActive(true)
    } catch (e:any) {
      setScanError(e?.message || 'Camera error')
    }
  }

  async function stopScan(keepLast=false) {
    setScanActive(false)

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
    if (zxingControlsRef.current) {
      try { zxingControlsRef.current.stop() } catch {}
      zxingControlsRef.current = null
    }
    const el = videoRef.current
    const stream = el?.srcObject as MediaStream | null
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      if (el) el.srcObject = null
    }
    if (!keepLast) lastCodeRef.current = ''
  }

  async function handleScanCode(raw: string) {
    setScanError('')
    setScanMessage('')

    // Expect "CYL:<uuid>"
    const [prefix, id] = raw.trim().split(':')
    if (prefix !== 'CYL' || !id) {
      setScanError('Invalid code. Use CYL:<uuid>')
      return
    }

    // Lookup cylinder
    const { data: cyl, error: getErr } = await supabase
      .from('cylinders')
      .select('id,label,status')
      .eq('id', id)
      .maybeSingle<Cyl>()
    if (getErr) { setScanError(getErr.message); return }
    if (!cyl) { setScanError('Cylinder not found'); return }

    // Toggle status
    const newStatus = cyl.status === 'available' ? 'out' : 'available'
    const { error: updErr } = await supabase
      .from('cylinders')
      .update({ status: newStatus })
      .eq('id', cyl.id)
    if (updErr) { setScanError(updErr.message); return }

    setScanMessage(`Cylinder ${cyl.label ?? cyl.id.slice(0,6)} → ${newStatus}`)
  }

  return (
    <div className="container">
      <h1>Scan Cylinders</h1>

      {scanError && <p style={{color:'#c0392b'}}>{scanError}</p>}
      {scanMessage && <p style={{color:'#2e7d32'}}>{scanMessage}</p>}

      {!scanActive ? (
        <button className="btn" onClick={startScan}>Start Camera</button>
      ) : (
        <button className="btn" onClick={() => stopScan()}>Stop</button>
      )}

      <video ref={videoRef} style={{ width:'100%', maxHeight:'40vh', marginTop:12, background:'#000' }} />

      <div style={{ display:'flex', gap:8, marginTop:12 }}>
        <input
          placeholder="Enter code (e.g. CYL:099e37d2-4341-464c-8207-ee891c59b129)"
          value={manualCode}
          onChange={(e)=>setManualCode(e.target.value)}
          style={{ flex:1 }}
        />
        <button className="btn" onClick={()=>handleScanCode(manualCode.trim())}>Submit</button>
      </div>
    </div>
  )
}
