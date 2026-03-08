import{f,h as m,g as c,b as g,e as h,t as l,c as y}from"./storage-CiY_4-N5.js";import{d as p}from"./exclusions-BEHkgM7c.js";import{r as v}from"./header-Dfc8t_b7.js";const a=["🎁","🎀","⭐","🍀","🎊","💚","🌟","🎯"];let d=!1;function x(e){const t=[0,1,2].map(n=>document.getElementById(`drum${n}`));t.forEach(n=>n.classList.add("spinning")),t.forEach((n,s)=>{let o=0;const i=setInterval(()=>{n.textContent=a[o++%a.length]},80);setTimeout(()=>{clearInterval(i),n.textContent=a[Math.floor(Math.random()*a.length)],n.classList.remove("spinning"),n.classList.add("locked"),s===2&&setTimeout(e,400)},900+s*500)})}function E(){const e=document.getElementById("confettiCanvas");e.width=window.innerWidth,e.height=window.innerHeight;const t=e.getContext("2d"),n=["#00704A","#C9A84C","#D4E9E2","#1E3932","#ffffff"],s=Array.from({length:140},()=>({x:Math.random()*e.width,y:Math.random()*-e.height,r:3+Math.random()*5,d:1.5+Math.random()*2.5,c:n[Math.floor(Math.random()*n.length)],rot:Math.random()*360,rs:(Math.random()-.5)*4}));let o=0;function i(){t.clearRect(0,0,e.width,e.height),s.forEach(r=>{t.save(),t.translate(r.x,r.y),t.rotate(r.rot*Math.PI/180),t.fillStyle=r.c,t.fillRect(-r.r,-r.r/2,r.r*2,r.r),t.restore(),r.y+=r.d,r.rot+=r.rs,r.y>e.height&&(r.y=-10,r.x=Math.random()*e.width)}),o++,o<200?requestAnimationFrame(i):t.clearRect(0,0,e.width,e.height)}i()}function u(e){const t=document.getElementById("resultsGrid");if(!t)return;t.innerHTML="",e.forEach((o,i)=>{const r=document.createElement("div");r.className="result-card",r.style.animationDelay=`${i*.1}s`,r.innerHTML=`
      <div class="result-giver">${o.giverName}</div>
      <div class="result-arrow">🎁</div>
      <div class="result-receiver">${o.receiverName}</div>
    `,t.appendChild(r)});const n=document.getElementById("slotSection"),s=document.getElementById("resultsSection");n&&(n.style.display="none"),s&&(s.style.display="block"),E()}function b(){if(d)return;const e=document.getElementById("btnReveal");e&&(e.classList.add("spinning"),x(()=>{e.classList.remove("spinning");const t=g(),n=h();if(t.length<2){l("No hay suficientes participantes","error");return}const s=p(t,n);if(!s){l("No se pudo sortear con las exclusiones actuales. Revísalas.","error");return}m(s),d=!0,u(s)}))}function w(){[0,1,2].forEach(e=>{const t=document.getElementById(`drum${e}`);t&&(t.classList.remove("locked","spinning"),t.textContent=["🎁","🎀","⭐"][e])})}function C(e,t){const n=document.createElement("div");n.style.cssText=`
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
  `,document.body.appendChild(n),n.querySelector("#confirmNo")?.addEventListener("click",()=>n.remove()),n.querySelector("#confirmYes")?.addEventListener("click",()=>{n.remove(),t()})}function L(){v({step:6,total:6,progress:100});const e=f();e.length>0&&(d=!0,u(e)),document.getElementById("btnReveal")?.addEventListener("click",b),document.getElementById("btnNewDraw")?.addEventListener("click",()=>{m([]),d=!1;const t=document.getElementById("slotSection"),n=document.getElementById("resultsSection");t&&(t.style.display="block"),n&&(n.style.display="none"),w()}),document.getElementById("btnBack")?.addEventListener("click",()=>{c("htmls/summary.html")}),document.getElementById("btnRestart")?.addEventListener("click",()=>{C("¿Empezar un nuevo evento desde cero?",()=>{y(),c("index.html")})})}document.addEventListener("DOMContentLoaded",L);
