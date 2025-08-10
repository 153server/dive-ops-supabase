
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Cyl = { id:string; label:string; size_l:number; material:string; wp_bar:number; o2_clean:boolean; vip_due:string; hydro_due:string; status:string; };
type Item = { id:string; type:string; size:string|null; serial:string|null; status:string; };

function Tab({active,onClick,children}:{active:boolean,onClick:()=>void,children:any}){
  return <button className={'tab '+(active?'active':'')} onClick={onClick}>{children}</button>
}
function Badge({tone='gray', children}:{tone?:'gray'|'red'|'green', children:any}){
  return <span className={'badge '+(tone==='red'?'red':tone==='green'?'green':'')}>{children}</span>
}

export default function Home({ session }: { session:any }){
  const [tab,setTab]=useState<'rental'|'cylinders'|'log'>('rental')
  const [cylinders,setCylinders]=useState<Cyl[]>([])
  const [items,setItems]=useState<Item[]>([])
  const [log,setLog]=useState<{ts:string,kind:string,detail:string}[]>([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    if(!session){ setLoading(false); return }
    ;(async()=>{
      se
        tLoading(true)
      const { data: cyls } = await supabase.from('cylinders').select('*').order('created_at',{ascending:false})
      const { data: it } = await supabase.from('rental_items').select('id,type,size,serial,status').order('created_at',{ascending:false})
      setCylinders((cyls||[]) as any)
      setItems((it||[]) as any)
      setLoading(false)
    })()
  },[session])

  function logEvent(kind:string, detail:string){ setLog(e=>[{ts:new Date().toLocaleString(), kind, detail}, ...e].slice(0,200)) }

  async function cylFill(id:string){
    await supabase.from('cylinder_events').insert({ cylinder_id:id, type:'fill', payload:{ level:'220', gas:'AIR' } })
    logEvent('cylinder.fill','Filled cylinder')
  }
  async function cylIssue(id:string){
    const { data: rows } = await supabase.from('cylinders').select('*').eq('id', id).single()
    if(!rows) return
    const vip = rows.vip_due, hydro = rows.hydro_due, status = rows.status
    const today = new Date().toISOString().slice(0,10)
    if (vip < today) return alert('Blocked: VIP overdue')
    if (hydro < today) return alert('Blocked: Hydro overdue')
    if (status !== 'available') return alert('Blocked: Status '+status)
    await supabase.from('cylinders').update({ status:'assigned' }).eq('id', id)
    await supabase.from('cylinder_events').insert({ cylinder_id:id, type:'issue', payload:{ pre_bar:200 } })
    setCylinders(cylinders.map(c=>c.id===id?{...c,status:'assigned'}:c))
    logEvent('cylinder.issue','Issued cylinder')
  }
  async function cylReturn(id:string){
    const post = Math.max(0, Math.round(Math.random()*80))
    await supabase.from('cylinders').update({ status:'available' }).eq('id', id)
    await supabase.from('cylinder_events').insert({ cylinder_id:id, type:'return', payload:{ post_bar:post } })
    setCylinders(cylinders.map(c=>c.id===id?{...c,status:'available'}:c))
    logEvent('cylinder.return','Returned cylinder')
  }

  async function checkoutItem(id:string){
    await supabase.from('rental_lines').insert({ session_id:null, item_id:id, action:'checkout', payload:{ condition:'ok' } })
    await supabase.from('rental_items').update({ status:'out' }).eq('id', id)
    setItems(items.map(i=>i.id===id?{...i,status:'out'}:i))
    logEvent('rental.checkout','Checked out item')
  }
  async function checkinItem(id:string, damaged:boolean){
    await supabase.from('rental_lines').insert({ session_id:null, item_id:id, action:'checkin', payload:{ damaged } })
    await supabase.from('rental_items').update({ status: damaged?'repair':'available' }).eq('id', id)
    setItems(items.map(i=>i.id===id?{...i,status: damaged?'repair':'available'}:i))
    logEvent('rental.checkin', damaged?'Damaged → repair':'Checked in')
  }

  const groups = useMemo(()=>{
    const g:any = { available:[], out:[], repair:[] }
    items.forEach(i=>g[i.status]?.push(i))
    return g
  },[items])

  if(!session){
    return (
      <div className="container">
        <div className="panel" style={{maxWidth:480, margin:'0 auto'}}>
          <h2>Login required</h2>
          <p className="small">Sign in first to load live data from Supabase.</p>
          <a className="btn primary" href="/login">Go to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
     
          <a className="btn" href="/scan">Scan cylinders in/out</a>
              <div className="header">
        <div className="tabs">
          <Tab active={tab==='rental'} onClick={()=>setTab('rental')}>Rental Desk</Tab>
          <Tab active={tab==='cylinders'} onClick={()=>setTab('cylinders')}>Cylinders</Tab>
          <Tab active={tab==='log'} onClick={()=>setTab('log')}>Event Log</Tab>
        </div>
      </div>

      {loading && <div className="panel">Loading…</div>}

      {!loading && tab==='rental' && (
        <div className="row">
          <div className="panel">
            <h3>Available</h3>
            <div className="grid2">
              {groups.available.map((r:Item)=>(
                <div className="card" key={r.id}>
                  <div>
                    <div><b>{r.type}</b> {r.size?`(${r.size})`:''}</div>
                    <div className="small">Serial {r.serial ?? '(bulk)'}</div>
                  </div>
                  <button className="btn primary" onClick={()=>checkoutItem(r.id)}>Check-out</button>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <h3>Out / Repairs</h3>
            <div className="grid2">
              {groups.out.map((r:Item)=>(
                <div className="card" key={'o'+r.id}>
                  <div>
                    <div><b>{r.type}</b> {r.size?`(${r.size})`:''}</div>
                    <div className="small">Serial {r.serial ?? '(bulk)'} • Status out</div>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button className="btn blue" onClick={()=>checkinItem(r.id,false)}>Check-in</button>
                    <button className="btn red" onClick={()=>checkinItem(r.id,true)}>Damaged</button>
                  </div>
                </div>
              ))}
              {groups.repair.map((r:Item)=>(
                <div className="card" key={'r'+r.id}>
                  <div>
                    <div><b>{r.type}</b> {r.size?`(${r.size})`:''}</div>
                    <div className="small">Serial {r.serial ?? '(bulk)'} • In repair</div>
                  </div>
                  <button className="btn" onClick={()=>checkinItem(r.id,false)}>Mark Repaired</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && tab==='cylinders' && (
        <div className="panel">
          {cylinders.map((c)=>{
            const today = new Date().toISOString().slice(0,10)
            const vipOver = c.vip_due && c.vip_due < today
            const hydroOver = c.hydro_due && c.hydro_due < today
            return (
              <div className="card" key={c.id}>
                <div>
                  <div><b>{c.label || `${c.size_l}L ${c.material} ${c.wp_bar}`}</b></div>
                  <div className="small">VIP {c.vip_due} • Hydro {c.hydro_due}</div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  {vipOver && <Badge tone='red'>VIP overdue</Badge>}
                  {hydroOver && <Badge tone='red'>Hydro overdue</Badge>}
                  <Badge tone={c.status==='available'?'green':'gray'}>{c.status}</Badge>
                  <button className="btn" onClick={()=>cylFill(c.id)}>Fill</button>
                  <button className="btn primary" onClick={()=>cylIssue(c.id)}>Issue</button>
                  <button className="btn blue" onClick={()=>cylReturn(c.id)}>Return</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!loading && tab==='log' && (
        <div className="panel">
          {log.length===0 && <div className="small">No events yet.</div>}
          {log.map((e,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid #eee',padding:'6px 0'}}>
              <div>{e.detail}</div><div className="small">{e.ts}</div>
            </div>
          ))}
        </div>
      )}

      <div className="footer">Hooked to Supabase — ensure RLS allows authenticated (it does). Sign in via magic link.</div>
    </div>
  )
}
