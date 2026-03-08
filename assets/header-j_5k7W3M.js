import{B as d}from"./storage-CiY_4-N5.js";function n({step:e,total:a,progress:r}){const s=document.getElementById("appHeader");s&&(s.innerHTML=`
    <header class="app-header">
      <div class="inner">
        <div class="brand">
          <img src="${d}CLICKWIN-LOGO-HEADERjpg" alt="Click & Win" class="brand-logo" />
        </div>
        <span class="step-indicator">Paso ${e} de ${a}</span>
      </div>
      <div class="progress-shell">
        <div class="progress-fill" style="width:${r}%"></div>
      </div>
    </header>
  `)}export{n as r};
