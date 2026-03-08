import{l as m,a as u,d as f,c as p}from"./storage-Chakis11.js";import{r as g}from"./header-DZdbKMvJ.js";function x(t){const[n,e,i]=t.split("-").map(Number);return new Date(n,e-1,i).toLocaleDateString("es-MX",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}function r(t,n){const e=document.getElementById(t);e&&(e.textContent=n)}function a(t,n){const e=document.getElementById(t);if(!e)return;const i=document.createElement("li");i.textContent=n,e.appendChild(i)}function y(){g({step:6,total:6,progress:100});const t=m(),n=u(),e=f();if(!t){window.location.href="/index.html";return}r("sumOrganizer",t.organizerName),r("sumEvent",t.eventName||t.eventType||"—"),r("sumDate",t.eventDate?x(t.eventDate):"—"),r("sumBudget",t.budget?`$${t.budget} MXN`:"—"),n.length===0?a("sumParticipants","Sin participantes registrados"):n.forEach(o=>{a("sumParticipants",o.isOrganizer?`${o.name} (organizador)`:o.name)});const i=e.filter(o=>o.excludedIds.length>0);i.length===0?(r("sumExclTitle","Sin exclusiones"),a("sumExclusions","Todas las combinaciones son válidas")):i.forEach(o=>{const s=n.find(d=>d.id===o.giverId)?.name??"?",c=o.excludedIds.map(d=>n.find(l=>l.id===d)?.name??"?").join(", ");a("sumExclusions",`${s} → no sortea a: ${c}`)}),document.getElementById("btnDraw")?.addEventListener("click",()=>{window.location.href="/htmls/draw.html"}),document.getElementById("btnRestart")?.addEventListener("click",()=>{v("¿Borrar todos los datos y empezar de nuevo?",()=>{p(),window.location.href="/index.html"})})}function v(t,n){const e=document.createElement("div");e.style.cssText=`
    position:fixed; inset:0; background:rgba(0,0,0,.6);
    z-index:999; display:flex; align-items:center;
    justify-content:center; padding:20px;
  `,e.innerHTML=`
    <div style="
      background:#fff; border-radius:16px; padding:28px;
      max-width:340px; width:100%; text-align:center;
      font-family:'Raleway',sans-serif;
    ">
      <p style="font-size:.95rem; color:#1a1a1a; margin-bottom:20px;">
        ${t}
      </p>
      <div style="display:flex; gap:10px; justify-content:center;">
        <button id="confirmNo" style="
          padding:10px 24px; border-radius:8px; font-weight:700;
          border:2px solid #00704A; background:#fff;
          color:#00704A; cursor:pointer; font-size:.9rem;
        ">Cancelar</button>
        <button id="confirmYes" style="
          padding:10px 24px; border-radius:8px; font-weight:700;
          border:2px solid #00704A; background:#00704A;
          color:#fff; cursor:pointer; font-size:.9rem;
        ">Sí, borrar</button>
      </div>
    </div>
  `,document.body.appendChild(e),e.querySelector("#confirmNo")?.addEventListener("click",()=>e.remove()),e.querySelector("#confirmYes")?.addEventListener("click",()=>{e.remove(),n()})}document.addEventListener("DOMContentLoaded",y);
