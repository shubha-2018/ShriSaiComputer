// FRONTEND-ONLY DEMO MODE
// Replaces the Express/MySQL API with data stored in this browser (localStorage).
// Switched on by  npm run demo  (VITE_MOCK=true). Data is NOT shared between devices/browsers.
import { STATUSES } from './ui.jsx';

const KEY = 'shreesai_mock_db_v2';
const DONE = ['मंजूर', 'दाखला वितरित'];
const SERVICES = [
  'उत्पन्न दाखला', 'जात प्रमाणपत्र', 'अधिवास / रहिवासी दाखला', 'नॉन क्रिमिलेयर', 'EWS प्रमाणपत्र',
  'राष्ट्रीयत्व प्रमाणपत्र', 'जन्म दाखला', 'मृत्यू दाखला', 'ज्येष्ठ नागरिक प्रमाणपत्र', 'रेशन कार्ड सेवा',
  '7/12 उतारा', '8-अ उतारा', 'फेरफार नोंद', 'इतर सेवा',
];
const METHODS = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Other'];

const seed = () => {
  const now = new Date();
  const ym = (offsetMonths, day = 12) => {
    const dt = new Date(now.getFullYear(), now.getMonth() - offsetMonths, day);
    return dt.toLocaleDateString('en-CA');
  };

  return {
    users: [
      { id: 1, username: 'admin', password: 'ChangeMe123!', full_name: 'Administrator', role: 'Admin', active: 1, created_at: ym(3) },
      { id: 2, username: 'staff', password: 'StaffChange123!', full_name: 'Staff Operator', role: 'Staff', active: 1, created_at: ym(2) },
    ],
    customers: [
      { id: 1, name: 'राहुल प्रकाश पाटील', mobile: '9822334455', alt_mobile: '9422112233', village: 'शिरपूर', address: 'घर क्र. ४२, गांधी चौक', notes: 'नियमित ग्राहक', created_at: ym(2) },
      { id: 2, name: 'सुनिता रमेश गायकवाड', mobile: '9766554433', alt_mobile: '', village: 'वरवाडे', address: 'आंबेडकर नगर', notes: 'उत्पन्न दाखला व रेशन कार्ड काम', created_at: ym(1) },
      { id: 3, name: 'गणेश विठ्ठल शिंदे', mobile: '9923445566', alt_mobile: '', village: 'बोराडी', address: 'मेन रोड, मारुती मंदिराजवळ', notes: '', created_at: ym(0) },
      { id: 4, name: 'अशोक नामदेव चौधरी', mobile: '9890112233', alt_mobile: '', village: 'थाळनेर', address: 'बाजार पेठ', notes: '', created_at: ym(0) },
    ],
    services: SERVICES.map((name, i) => ({ id: i + 1, name, department: 'आपले सरकार / महसूल विभाग' })),
    applications: [
      { id: 1, customer_id: 1, service_id: 1, app_no: 'INC-2026-0041', applied: ym(1, 5), status: 'मंजूर', govt_fee: 33, service_fee: 67, paid: 100, delivery: ym(0, 2), notes: 'दाखला वितरित केला', created_by: 'admin', created_at: ym(1) },
      { id: 2, customer_id: 2, service_id: 2, app_no: 'CST-2026-0189', applied: ym(0, 10), status: 'प्रलंबित', govt_fee: 55, service_fee: 95, paid: 100, delivery: '', notes: 'तहसीलदार कार्यालयात प्रलंबित', created_by: 'staff', created_at: ym(0) },
      { id: 3, customer_id: 3, service_id: 3, app_no: 'DOM-2026-0312', applied: ym(0, 14), status: 'नवीन अर्ज', govt_fee: 33, service_fee: 67, paid: 50, delivery: '', notes: 'कागदपत्रे तपासली', created_by: 'admin', created_at: ym(0) },
      { id: 4, customer_id: 4, service_id: 11, app_no: '712-2026-0881', applied: ym(0, 18), status: 'दाखला वितरित', govt_fee: 20, service_fee: 30, paid: 50, delivery: ym(0, 18), notes: 'डिजिटल 7/12 प्रिंट दिली', created_by: 'staff', created_at: ym(0) },
    ],
    transactions: [
      { id: 1, kind: 'Income', category: 'दाखला सेवा शुल्क', amount: 1450, date: ym(4, 15), method: 'Cash', party: 'नागरिक फी', customer_id: null, description: 'मागील महिन्यातील एकूण दाखले', created_by: 'admin', created_at: ym(4) },
      { id: 2, kind: 'Expense', category: 'झेरॉक्स पेपर व स्टेशनरी', amount: 520, date: ym(4, 18), method: 'Cash', party: 'साई स्टेशनरी मार्ट', customer_id: null, description: 'A4 बंडल', created_by: 'admin', created_at: ym(4) },
      { id: 3, kind: 'Income', category: 'दाखला सेवा शुल्क', amount: 3200, date: ym(3, 10), method: 'UPI', party: 'ऑनलाइन पेमेंट', customer_id: null, description: 'दाखला व ऑनलाइन फॉर्म फी', created_by: 'admin', created_at: ym(3) },
      { id: 4, kind: 'Expense', category: 'प्रिंटर इंक रीफिल', amount: 650, date: ym(3, 22), method: 'Cash', party: 'कॉम्प्युटर केअर', customer_id: null, description: 'ब्लॅक व कलर इंक', created_by: 'admin', created_at: ym(3) },
      { id: 5, kind: 'Income', category: 'दाखला अर्ज फी', amount: 4100, date: ym(2, 12), method: 'Cash', party: 'नागरिक', customer_id: 1, description: '', created_by: 'admin', created_at: ym(2) },
      { id: 6, kind: 'Expense', category: 'इंटरनेट बिल (Wi-Fi)', amount: 799, date: ym(2, 25), method: 'UPI', party: 'Airtel Broadband', customer_id: null, description: 'मासिक बिल', created_by: 'admin', created_at: ym(2) },
      { id: 7, kind: 'Income', category: 'उत्पन्न व जात दाखला फी', amount: 4850, date: ym(1, 14), method: 'UPI', party: 'सुनिता गायकवाड / इतर', customer_id: 2, description: '', created_by: 'staff', created_at: ym(1) },
      { id: 8, kind: 'Expense', category: 'कार्यालयीन देखभाल', amount: 350, date: ym(1, 20), method: 'Cash', party: 'इलेक्ट्रिशियन', customer_id: null, description: 'बोर्ड दुरुस्ती', created_by: 'admin', created_at: ym(1) },
      { id: 9, kind: 'Income', category: 'दाखला अर्ज व प्रिंटिंग', amount: 3600, date: ym(0, 8), method: 'UPI', party: 'नागरिक वर्ग', customer_id: 3, description: '', created_by: 'admin', created_at: ym(0) },
      { id: 10, kind: 'Expense', category: 'चहा-नाश्ता व किरकोळ खर्च', amount: 280, date: ym(0, 15), method: 'Cash', party: 'हॉटेल साई', customer_id: null, description: '', created_by: 'staff', created_at: ym(0) },
    ],
  };
};

function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); if (d) return d; } catch { /* ignore */ }
  const d = seed(); save(d); return d;
}
const save = (d) => localStorage.setItem(KEY, JSON.stringify(d));

const nextId = (arr) => arr.reduce((m, x) => Math.max(m, x.id), 0) + 1;
const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
const str = (v) => { if (v === undefined || v === null) return null; const s = String(v).trim(); return s === '' ? null : s; };
const dateOrNull = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(v || '') ? v : null);
const today = () => new Date().toLocaleDateString('en-CA');
const fail = (message, status = 400) => Object.assign(new Error(message), { status });
const has = (v, s) => (v || '').toString().toLowerCase().includes(s);

const readFile = (file) => new Promise((resolve) => {
  if (!file || file.size > 2 * 1024 * 1024) return resolve(null);      // demo: keep files up to 2 MB only
  const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = () => resolve(null); r.readAsDataURL(file);
});

function toObject(body) {
  if (!(body instanceof FormData)) return body || {};
  const o = {}; body.forEach((v, k) => { o[k] = v; }); return o;
}

const appView = (db, a) => {
  const c = db.customers.find((x) => x.id === a.customer_id) || {};
  const s = db.services.find((x) => x.id === a.service_id) || {};
  const { file_data, ...rest } = a;                                      // eslint-disable-line no-unused-vars
  return { ...rest, customer: c.name, mobile: c.mobile, service: s.name };
};

const txFilter = (db, P) => {
  const kind = P.get('kind'); const s = (P.get('q') || '').toLowerCase(); const from = P.get('from'); const to = P.get('to');
  return db.transactions
    .filter((t) => (!from || t.date >= from) && (!to || t.date <= to) && (!kind || t.kind === kind)
      && (!s || has(t.category, s) || has(t.party, s) || has(t.description, s)))
    .sort((a, b) => (b.date + String(b.id).padStart(9, '0')).localeCompare(a.date + String(a.id).padStart(9, '0')))
    .map((t) => ({ ...t, customer: db.customers.find((c) => c.id === t.customer_id)?.name || null }));
};

export async function mockRequest(method, url, body, token) {
  const [path, qs] = url.split('?'); const P = new URLSearchParams(qs || '');
  const seg = path.split('/').filter(Boolean); const db = load(); const b = toObject(body);

  if (seg[0] === 'auth' && seg[1] === 'login') {
    const u = db.users.find((x) => x.username === String(b.username || '').trim() && x.active);
    if (!u || u.password !== String(b.password)) throw fail('लॉगिन तपशील चुकीचे आहेत. (Wrong username or password)', 401);
    return { token: `mock:${u.id}`, user: { id: u.id, username: u.username, full_name: u.full_name, role: u.role } };
  }
  const me = db.users.find((u) => `mock:${u.id}` === token && u.active);
  if (!me) throw fail('Session expired, please login again', 401);
  const admin = () => { if (me.role !== 'Admin') throw fail('Admin only', 403); };
  const [res, id, sub] = [seg[0], Number(seg[1]), seg[2]];

  // ---------- auth ----------
  if (res === 'auth' && seg[1] === 'me') return { user: { id: me.id, username: me.username, full_name: me.full_name, role: me.role } };
  if (res === 'auth' && seg[1] === 'password') {
    if (String(b.next || '').length < 10) throw fail('किमान 10 अक्षरे वापरा (min 10 characters)');
    if (b.current !== me.password) throw fail('सध्याचा पासवर्ड चुकीचा आहे (current password is wrong)');
    me.password = String(b.next); save(db); return { ok: true };
  }

  // ---------- users ----------
  if (res === 'users') {
    admin();
    if (method === 'GET') return db.users.map(({ password, ...u }) => u);          // eslint-disable-line no-unused-vars
    if (method === 'POST') {
      const username = str(b.username);
      if (!username) throw fail('Username required');
      if (String(b.password || '').length < 10) throw fail('Password min 10 characters');
      if (db.users.some((u) => u.username === username)) throw fail('हा username आधीच आहे (already exists)', 409);
      db.users.push({ id: nextId(db.users), username, password: String(b.password), full_name: str(b.full_name), role: b.role === 'Admin' ? 'Admin' : 'Staff', active: 1, created_at: today() });
      save(db); return { ok: true };
    }
    if (method === 'PUT') {
      const u = db.users.find((x) => x.id === id); if (!u) throw fail('Not found', 404);
      const role = b.role === 'Admin' ? 'Admin' : 'Staff'; const active = b.active ? 1 : 0;
      if (id === me.id && (!active || role !== 'Admin')) throw fail('You cannot disable or demote yourself');
      if (b.password && String(b.password).length < 10) throw fail('Password min 10 characters');
      Object.assign(u, { full_name: str(b.full_name), role, active }); if (b.password) u.password = String(b.password);
      save(db); return { ok: true };
    }
  }

  // ---------- customers ----------
  if (res === 'customers') {
    const fields = () => ({ name: str(b.name), mobile: str(b.mobile), alt_mobile: str(b.alt_mobile), village: str(b.village), address: str(b.address), notes: str(b.notes) });
    if (method === 'GET' && !id) {
      const s = (P.get('q') || '').trim().toLowerCase();
      return db.customers.filter((c) => !s || has(c.name, s) || has(c.mobile, s) || has(c.village, s))
        .sort((a, c) => c.id - a.id).map((c) => ({ ...c, app_count: db.applications.filter((a) => a.customer_id === c.id).length }));
    }
    if (method === 'GET') {
      const c = db.customers.find((x) => x.id === id); if (!c) throw fail('Customer not found', 404);
      return {
        ...c,
        applications: db.applications.filter((a) => a.customer_id === id).sort((a, z) => z.id - a.id).map((a) => appView(db, a)),
        transactions: txFilter(db, new URLSearchParams()).filter((t) => t.customer_id === id),
      };
    }
    if (method === 'POST') {
      const f = fields(); if (!f.name) throw fail('नाव आवश्यक आहे (name required)');
      const row = { id: nextId(db.customers), ...f, created_at: today() }; db.customers.push(row); save(db); return { id: row.id };
    }
    if (method === 'PUT') {
      const f = fields(); if (!f.name) throw fail('नाव आवश्यक आहे (name required)');
      Object.assign(db.customers.find((x) => x.id === id) || {}, f); save(db); return { ok: true };
    }
    if (method === 'DELETE') {
      admin();
      if (db.applications.some((a) => a.customer_id === id)) throw fail('या ग्राहकाचे अर्ज आहेत; आधी ते अर्ज delete करा. (Customer has applications)', 409);
      db.customers = db.customers.filter((c) => c.id !== id);
      db.transactions.forEach((t) => { if (t.customer_id === id) t.customer_id = null; });
      save(db); return { ok: true };
    }
  }

  // ---------- services ----------
  if (res === 'services') {
    if (method === 'GET') return [...db.services].sort((a, z) => a.name.localeCompare(z.name, 'mr'));
    const name = str(b.name);
    if (method === 'POST') {
      if (!name) throw fail('सेवा नाव आवश्यक आहे');
      if (db.services.some((s) => s.name === name)) throw fail('ही सेवा आधीच आहे (already exists)', 409);
      db.services.push({ id: nextId(db.services), name, department: str(b.department) }); save(db); return { ok: true };
    }
    if (method === 'PUT') {
      admin(); if (!name) throw fail('सेवा नाव आवश्यक आहे');
      if (db.services.some((s) => s.name === name && s.id !== id)) throw fail('ही सेवा आधीच आहे (already exists)', 409);
      Object.assign(db.services.find((s) => s.id === id) || {}, { name, department: str(b.department) }); save(db); return { ok: true };
    }
    if (method === 'DELETE') {
      admin();
      if (db.applications.some((a) => a.service_id === id)) throw fail('ही सेवा अर्जांमध्ये वापरली आहे, delete करता येत नाही. (Service in use)', 409);
      db.services = db.services.filter((s) => s.id !== id); save(db); return { ok: true };
    }
  }

  // ---------- applications ----------
  if (res === 'applications') {
    if (method === 'GET' && !id) {
      const s = (P.get('q') || '').trim().toLowerCase(); const st = P.get('status'); const cid = P.get('customer_id');
      return db.applications.map((a) => appView(db, a))
        .filter((a) => (!st || a.status === st) && (!cid || a.customer_id === Number(cid))
          && (!s || has(a.customer, s) || has(a.mobile, s) || has(a.app_no, s) || has(a.service, s)))
        .sort((a, z) => z.id - a.id);
    }
    if (method === 'GET' && !sub) { const a = db.applications.find((x) => x.id === id); if (!a) throw fail('Application not found', 404); return appView(db, a); }
    if (method === 'GET' && sub === 'file') throw fail('use download');
    const read = () => ({
      customer_id: Number(b.customer_id), service_id: Number(b.service_id), app_no: str(b.app_no),
      applied: dateOrNull(b.applied) || today(), status: STATUSES.includes(b.status) ? b.status : STATUSES[0],
      govt_fee: num(b.govt_fee), service_fee: num(b.service_fee), paid: num(b.paid), delivery: dateOrNull(b.delivery), notes: str(b.notes),
    });
    if (method === 'POST' || method === 'PUT') {
      const d = read(); if (!d.customer_id || !d.service_id) throw fail('ग्राहक आणि सेवा निवडा (customer and service required)');
      const file = b.file instanceof File ? b.file : null;
      const fileData = file ? await readFile(file) : null;
      if (method === 'POST') {
        const row = { id: nextId(db.applications), ...d, file_name: file ? 'attached' : null, file_original: file ? file.name : null, file_data: fileData, created_by: me.username, created_at: today() };
        db.applications.push(row);
        if (b.record_income === 'true' && d.paid > 0) {
          db.transactions.push({
            id: nextId(db.transactions), kind: 'Income', category: 'दाखला फी', amount: d.paid, date: d.applied, method: 'Cash',
            party: db.customers.find((c) => c.id === d.customer_id)?.name || null, customer_id: d.customer_id, application_id: row.id,
            description: db.services.find((s) => s.id === d.service_id)?.name || null, created_by: me.username, created_at: today(),
          });
        }
        save(db); return { id: row.id };
      }
      const a = db.applications.find((x) => x.id === id); if (!a) throw fail('Application not found', 404);
      Object.assign(a, d); if (file) Object.assign(a, { file_name: 'attached', file_original: file.name, file_data: fileData });
      save(db); return { ok: true };
    }
    if (method === 'DELETE') {
      admin(); db.applications = db.applications.filter((a) => a.id !== id);
      db.transactions.forEach((t) => { if (t.application_id === id) t.application_id = null; });
      save(db); return { ok: true };
    }
  }

  // ---------- transactions ----------
  if (res === 'transactions') {
    if (method === 'GET') {
      const rows = txFilter(db, P);
      const income = rows.filter((t) => t.kind === 'Income').reduce((s, t) => s + t.amount, 0);
      const expense = rows.filter((t) => t.kind === 'Expense').reduce((s, t) => s + t.amount, 0);
      return { rows, totals: { income, expense, balance: income - expense } };
    }
    const v = {
      kind: b.kind === 'Expense' ? 'Expense' : 'Income', category: str(b.category), amount: num(b.amount), date: dateOrNull(b.date) || today(),
      method: METHODS.includes(b.method) ? b.method : 'Cash', party: str(b.party), customer_id: b.customer_id ? Number(b.customer_id) : null, description: str(b.description),
    };
    if (method === 'POST' || method === 'PUT') {
      if (!v.category) throw fail('वर्ग / कारण आवश्यक आहे (category required)');
      if (!(v.amount > 0)) throw fail('रक्कम 0 पेक्षा जास्त हवी (amount must be > 0)');
    }
    if (method === 'POST') { const row = { id: nextId(db.transactions), ...v, application_id: null, created_by: me.username, created_at: today() }; db.transactions.push(row); save(db); return { id: row.id }; }
    if (method === 'PUT') { admin(); Object.assign(db.transactions.find((t) => t.id === id) || {}, v); save(db); return { ok: true }; }
    if (method === 'DELETE') { admin(); db.transactions = db.transactions.filter((t) => t.id !== id); save(db); return { ok: true }; }
  }

  // ---------- dashboard ----------
  if (res === 'dashboard') {
    const income = db.transactions.filter((t) => t.kind === 'Income').reduce((s, t) => s + t.amount, 0);
    const expense = db.transactions.filter((t) => t.kind === 'Expense').reduce((s, t) => s + t.amount, 0);
    const d0 = new Date(); d0.setDate(1); d0.setMonth(d0.getMonth() - 5);
    const from = d0.toLocaleDateString('en-CA'); const months = {};
    db.transactions.filter((t) => t.date >= from).forEach((t) => {
      const m = t.date.slice(0, 7); months[m] = months[m] || { month: m, income: 0, expense: 0 };
      months[m][t.kind === 'Income' ? 'income' : 'expense'] += t.amount;
    });
    const pending = db.applications.filter((a) => !DONE.includes(a.status));
    return {
      income, expense, balance: income - expense, customers: db.customers.length, apps: db.applications.length, pending: pending.length,
      monthly: Object.values(months).sort((a, z) => a.month.localeCompare(z.month)),
      recentApps: [...pending].sort((a, z) => z.id - a.id).slice(0, 8).map((a) => appView(db, a)),
    };
  }
  throw fail('Not found', 404);
}

// ---------- downloads (CSV instead of XLSX, JSON instead of ZIP) ----------
export async function mockDownload(url, token) {
  const db = load(); const [path, qs] = url.split('?'); const P = new URLSearchParams(qs || '');
  if (!db.users.some((u) => `mock:${u.id}` === token && u.active)) throw fail('Session expired', 401);
  const csv = (rows) => rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
  if (path.startsWith('/reports/excel')) {
    const tx = txFilter(db, P);
    const rows = [['Date', 'Type', 'Category', 'Amount', 'Method', 'Person', 'Customer', 'Description', 'Entered By'],
      ...tx.map((t) => [t.date, t.kind, t.category, t.amount, t.method, t.party, t.customer, t.description, t.created_by])];
    return { blob: new Blob(['\ufeff' + csv(rows)], { type: 'text/csv;charset=utf-8' }), name: 'Shree_Sai_Report_DEMO.csv' };
  }
  if (path === '/backup') {
    const data = { ...db, users: db.users.map(({ password, ...u }) => u), applications: db.applications.map(({ file_data, ...a }) => a) }; // eslint-disable-line no-unused-vars
    return { blob: new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), name: 'ShreeSai_Backup_DEMO.json' };
  }
  const m = /^\/applications\/(\d+)\/file/.exec(path);
  if (m) {
    const a = db.applications.find((x) => x.id === Number(m[1]));
    if (!a?.file_data) throw fail('Demo mode keeps only files up to 2 MB; this file was not stored.', 404);
    return { blob: await (await fetch(a.file_data)).blob(), name: a.file_original || 'file' };
  }
  throw fail('Not found', 404);
}
