import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/main.css';

export function toast(msg: string, type: 'success' | 'error' = 'success'): void {
  const zone = document.getElementById('toastZone');
  if (!zone) return;
  const el      = document.createElement('div');
  el.className  = `toast-msg${type === 'error' ? ' err' : ''}`;
  el.textContent = msg;
  zone.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

export function clearInput(id: string): void {
  const el = document.getElementById(id) as HTMLInputElement | null;
  if (el) { el.value = ''; el.focus(); }
}

export function go(path: string): void {
  window.location.href = path;
}