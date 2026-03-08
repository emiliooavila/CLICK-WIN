interface HeaderOptions {
  step:     number; 
  total:    number; 
  progress: number;
}

export function renderHeader({ step, total, progress }: HeaderOptions): void {
  const container = document.getElementById('appHeader');
  if (!container) return;

  container.innerHTML = `
    <header class="app-header">
      <div class="inner">
        <div class="brand">
          <img src="/CLICK&WIN-LOGO-HEADER.jpg" alt="Click & Win" class="brand-logo" />
        </div>
        <span class="step-indicator">Paso ${step} de ${total}</span>
      </div>
      <div class="progress-shell">
        <div class="progress-fill" style="width:${progress}%"></div>
      </div>
    </header>
  `;
}