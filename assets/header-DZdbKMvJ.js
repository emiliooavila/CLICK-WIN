function d({step:s,total:a,progress:r}){const e=document.getElementById("appHeader");e&&(e.innerHTML=`
    <header class="app-header">
      <div class="inner">
        <div class="brand">
          <img src="/CLICK&WIN-LOGO-HEADER.jpg" alt="Click & Win" class="brand-logo" />
        </div>
        <span class="step-indicator">Paso ${s} de ${a}</span>
      </div>
      <div class="progress-shell">
        <div class="progress-fill" style="width:${r}%"></div>
      </div>
    </header>
  `)}export{d as r};
