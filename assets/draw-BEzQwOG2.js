import{e as u,f as l,a as f,d as h,c as g}from"./storage-Chakis11.js";import{t as c}from"./shared-DvBB2LqT.js";import{d as y}from"./exclusions-DrhWUcSq.js";import{r as p}from"./header-DZdbKMvJ.js";const a=["🎁","🎀","⭐","🍀","🎊","💚","🌟","🎯"];let d=!1;function v(e){const t=[0,1,2].map(n=>document.getElementById(`drum${n}`));t.forEach(n=>n.classList.add("spinning")),t.forEach((n,o)=>{let s=0;const i=setInterval(()=>{n.textContent=a[s++%a.length]},80);setTimeout(()=>{clearInterval(i),n.textContent=a[Math.floor(Math.random()*a.length)],n.classList.remove("spinning"),n.classList.add("locked"),o===2&&setTimeout(e,400)},900+o*500)})}function x(){const e=document.getElementById("confettiCanvas");e.width=window.innerWidth,e.height=window.innerHeight;const t=e.getContext("2d"),n=["#00704A","#C9A84C","#D4E9E2","#1E3932","#ffffff"],o=Array.from({length:140},()=>({x:Math.random()*e.width,y:Math.random()*-e.height,r:3+Math.random()*5,d:1.5+Math.random()*2.5,c:n[Math.floor(Math.random()*n.length)],rot:Math.random()*360,rs:(Math.random()-.5)*4}));let s=0;function i(){t.clearRect(0,0,e.width,e.height),o.forEach(r=>{t.save(),t.translate(r.x,r.y),t.rotate(r.rot*Math.PI/180),t.fillStyle=r.c,t.fillRect(-r.r,-r.r/2,r.r*2,r.r),t.restore(),r.y+=r.d,r.rot+=r.rs,r.y>e.height&&(r.y=-10,r.x=Math.random()*e.width)}),s++,s<200?requestAnimationFrame(i):t.clearRect(0,0,e.width,e.height)}i()}function m(e){const t=document.getElementById("resultsGrid");if(!t)return;t.innerHTML="",e.forEach((s,i)=>{const r=document.createElement("div");r.className="result-card",r.style.animationDelay=`${i*.1}s`,r.innerHTML=`
      <div class="result-giver">${s.giverName}</div>
      <div class="result-arrow">🎁</div>
      <div class="result-receiver">${s.receiverName}</div>
    `,t.appendChild(r)});const n=document.getElementById("slotSection"),o=document.getElementById("resultsSection");n&&(n.style.display="none"),o&&(o.style.display="block"),x()}function E(){if(d)return;const e=document.getElementById("btnReveal");e&&(e.classList.add("spinning"),v(()=>{e.classList.remove("spinning");const t=f(),n=h();if(t.length<2){c("No hay suficientes participantes","error");return}const o=y(t,n);if(!o){c("No se pudo sortear con las exclusiones actuales. Revísalas.","error");return}l(o),d=!0,m(o)}))}function w(){[0,1,2].forEach(e=>{const t=document.getElementById(`drum${e}`);t&&(t.classList.remove("locked","spinning"),t.textContent=["🎁","🎀","⭐"][e])})}function b(e,t){const n=document.createElement("div");n.style.cssText=`
    position:fixed; inset:0; background:rgba(0,0,0,.65);
    z-index:999; display:flex; align-items:center;
    justify-content:center; padding:20px;
  `,n.innerHTML=`
    <div style="
      background:#1a3d28;
      border:2px solid rgba(201,168,76,.4);
      border-radius:16px; padding:28px;
      max-width:340px; width:100%;
      text-align:center;
      font-family:'Raleway',sans-serif;
      box-shadow: 0 8px 38px rgba(0,0,0,.4);
    ">
      <p style="font-size:.95rem; color:#fff; margin-bottom:20px; line-height:1.5;">
        ${e}
      </p>
      <div style="display:flex; gap:10px; justify-content:center;">
        <button id="confirmNo" style="
          padding:10px 24px; border-radius:8px; font-weight:700;
          border:2px solid #C9A84C; background:transparent;
          color:#C9A84C; cursor:pointer; font-size:.9rem;
          font-family:'Raleway',sans-serif;
        ">Cancelar</button>
        <button id="confirmYes" style="
          padding:10px 24px; border-radius:8px; font-weight:700;
          border:2px solid #C9A84C;
          background:linear-gradient(135deg,#C9A84C,#a07830);
          color:#0d1f15; cursor:pointer; font-size:.9rem;
          font-family:'Raleway',sans-serif;
        ">Sí, borrar</button>
      </div>
    </div>
  `,document.body.appendChild(n),n.querySelector("#confirmNo")?.addEventListener("click",()=>n.remove()),n.querySelector("#confirmYes")?.addEventListener("click",()=>{n.remove(),t()})}function C(){p({step:6,total:6,progress:100});const e=u();e.length>0&&(d=!0,m(e)),document.getElementById("btnReveal")?.addEventListener("click",E),document.getElementById("btnNewDraw")?.addEventListener("click",()=>{l([]),d=!1;const t=document.getElementById("slotSection"),n=document.getElementById("resultsSection");t&&(t.style.display="block"),n&&(n.style.display="none"),w()}),document.getElementById("btnBack")?.addEventListener("click",()=>{window.location.href="/htmls/summary.html"}),document.getElementById("btnRestart")?.addEventListener("click",()=>{b("¿Empezar un nuevo evento desde cero?",()=>{g(),window.location.href="/index.html"})})}document.addEventListener("DOMContentLoaded",C);
