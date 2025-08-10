import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient'

export default function Scan(){
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [detected, setDetected] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [manual, setManual] = useState<string>('');
  const [lookup, setLookup] = useState<any>(null);

  async function start(){
    setError('');
    setDetected('');
    try{
      // @ts-ignore
      const has = 'BarcodeDetector' in window && (await BarcodeDetector.getSupportedFormats?.())?.includes('qr_code');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if(videoRef.current){
        (videoRef.current as any).srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
      if(has){
        // @ts-ignore
        const detector = new BarcodeDetector({ formats: ['qr_code'] });
        const scanLoop = async ()=>{
          if(!videoRef.current) return;
          try{
            const detections = await detector.detect(videoRef.current);
            if(detections && detections.length > 0){
              const best = detections[0].rawValue || '';
              if(best){
                onDetected(best);
                return;
              }
            }
          }catch(e){}
          if(active) requestAnimationFrame(scanLoop);
        };
        requestAnimationFrame(scanLoop);
      }
    }catch(e:any){
      setError(e.message || 'Camera error');
      setActive(false);
    }
  }

  function stop(){
    if(videoRef.current && (videoRef.current as any).srcObject){
      const tracks = ((videoRef.current as any).srcObject as MediaStream).getTracks();
      tracks.forEach(t=>t.stop());
      (videoRef.current as any).srcObject = null;
    }
    setActive(false);
  }

  async function onDetected(code:string){
    setDetected(code);
    // Try interpret: CYL:<uuid> or RIT:<uuid>
    let type = null, id = null;
       
    if(code.startsWith('CYL:')){ type='cylinder'; id = code.slice(4); }
    if(code.startsWith('RIT:')){ type='rental'; id = code.slice(4); }
    if(!type){ setLookup({ error:'Unknown code format' }); return; }

    if(type==='cylinder'){
      // first try as UUID
      let q = supabase.from('cylinders').select('*').eq('id', id).maybeSingle();
      let { data, error } = await q;
      if(!data){
        // try index fallback (e.g., CYL:0)
        const idx = parseInt(id,10);
        if(!isNaN(idx)){
          const { data: list } = await supabase.from('cylinders').select('*').order('created_at',{ascending:true});
          if(list && list[idx]) data = list[idx];
        }
         // toggle status for cylinder
      if(data){
        const newStatus = data.status === 'available' ? 'out' : 'available';
        const { error: updateError } = await supabase
          .from('cylinders')
          .update({ status: newStatus })
          .eq('id', data.id);
        if(!updateError){
          data.status = newStatus;
        }
      }

      }
      setLookup({ type, data, error });
    } else {
      let { data, error } = await supabase.from('rental_items').select('*').eq('id', id).maybeSingle();
      if(!data){
        const idx = parseInt(id,10);
        if(!isNaN(idx)){
          const { data: list } = await supabase.from('rental_items').select('*').order('created_at',{ascending:true});
          if(list && list[idx]) data = list[idx];
        }
      }
      setLookup({ type, data, error });
    }
    stop();
  }

  useEffect(()=>()=>stop(),[])

  return (
    <div className="container">
      <div className="panel" style={{maxWidth:820, margin:'0 auto'}}>
        <h2>QR Scanner</h2>
        <p className="small">HTTPS required. Code formats: <code>CYL:&lt;uuid or index&gt;</code>, <code>RIT:&lt;uuid or index&gt;</code>.</p>
        <div style={{display:'flex', gap:12, margin:'12px 0'}}>
          {!active ? <button className="btn" onClick={start}>Start Camera</button> :
                      <button className="btn red" onClick={stop}>Stop</button>}
          <a className="btn" href="/">Back</a>
        </div>

        {error && <div className="small" style={{color:'#b91c1c'}}>Error: {error}</div>}

        <div style={{position:'relative', background:'#000', borderRadius:12, overflow:'hidden'}}>
          <video ref={videoRef} playsInline muted style={{width:'100%'}} />
        </div>

        <div style={{border:'1px solid #e5e7eb', borderRadius:12, padding:12, marginTop:12}}>
          <div className="small" style={{marginBottom:6}}>Manual entry (fallback)</div>
          <div style={{display:'flex', gap:8}}>
            <input className="input" placeholder="e.g., CYL:0 or RIT:0 or CYL:<uuid>" value={manual} onChange={e=>setManual(e.target.value)} />
            <button className="btn primary" onClick={()=>onDetected(manual)}>Submit</button>
          </div>
        </div>

        <div style={{marginTop:12}}>
          <div className="small">Detected code</div>
          <div className="card"><div>{detected || '—'}</div></div>
        </div>

        {lookup && (
          <div className="panel" style={{marginTop:12}}>
            {!lookup.data && <div className="small">Not found.</div>}
            {lookup.data && (
              <pre style={{whiteSpace:'pre-wrap', fontSize:12, background:'#f3f4f6', padding:12, borderRadius:12}}>{JSON.stringify(lookup.data, null, 2)}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
