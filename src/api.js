import { mockRequest, mockDownload } from './mockApi.js';

export const MOCK = import.meta.env.VITE_MOCK === 'true';   // frontend-only demo mode (no backend)
const TOKEN_KEY = 'shreesai_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

async function request(method, url, body) {
  if (MOCK) {
    try { return await mockRequest(method, url, body, getToken()); }
    catch (e) { if (e.status === 401 && !url.startsWith('/auth/login')) onUnauthorized(); throw e; }
  }
  const headers = {};
  const t = getToken();
  if (t) headers.Authorization = `Bearer ${t}`;
  let payload;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }

  const res = await fetch(`/api${url}`, { method, headers, body: payload });
  if (res.status === 401 && !url.startsWith('/auth/login')) onUnauthorized();
  if (!res.ok) {
    let msg = 'Something went wrong';
    try { msg = (await res.json()).error || msg; } catch { /* ignore */ }
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  get: (u) => request('GET', u),
  post: (u, b) => request('POST', u, b),
  put: (u, b) => request('PUT', u, b),
  del: (u) => request('DELETE', u),
};

// Authenticated file download (PDF/ZIP/XLSX/attachments)
export async function download(url, fallbackName) {
  if (MOCK) {
    const { blob, name } = await mockDownload(url, getToken());
    return saveBlob(blob, name || fallbackName);
  }
  const res = await fetch(`/api${url}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!res.ok) {
    let msg = 'Download failed';
    try { msg = (await res.json()).error || msg; } catch { /* ignore */ }
    throw new Error(msg);
  }
  const cd = res.headers.get('Content-Disposition') || '';
  const m = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(cd);
  const name = m ? decodeURIComponent(m[1]) : fallbackName;
  saveBlob(await res.blob(), name);
}

function saveBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export const money = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const todayStr = () => new Date().toLocaleDateString('en-CA');
