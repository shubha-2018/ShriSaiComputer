import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, download, todayStr } from '../api.js';
import { STATUSES, useNotice, Notice, Field } from '../ui.jsx';
import { IconFileText, IconCheck, IconX, IconPaperclip } from '../components/Icons.jsx';

export default function ApplicationForm() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const n = useNotice();
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [existing, setExisting] = useState(null);
  const [file, setFile] = useState(null);
  const [recordIncome, setRecordIncome] = useState(false);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({
    customer_id: sp.get('customer') || '',
    service_id: '',
    app_no: '',
    applied: todayStr(),
    status: STATUSES[0],
    govt_fee: 0,
    service_fee: 0,
    paid: 0,
    delivery: '',
    notes: ''
  });

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    api.get('/customers').then(setCustomers).catch(n.err);
    api.get('/services').then(setServices).catch(n.err);
    if (id) {
      api
        .get(`/applications/${id}`)
        .then((a) => {
          setExisting(a);
          setF({
            customer_id: a.customer_id,
            service_id: a.service_id,
            app_no: a.app_no || '',
            applied: a.applied || '',
            status: a.status,
            govt_fee: a.govt_fee,
            service_fee: a.service_fee,
            paid: a.paid,
            delivery: a.delivery || '',
            notes: a.notes || ''
          });
        })
        .catch(n.err);
    }
  }, [id]); // eslint-disable-line

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => fd.append(k, v ?? ''));
    if (file) fd.append('file', file);
    if (!id && recordIncome) fd.append('record_income', 'true');
    try {
      if (id) await api.put(`/applications/${id}`, fd);
      else await api.post('/applications', fd);
      nav('/applications');
    } catch (err) {
      n.err(err);
      setBusy(false);
    }
  };

  const govtFee = Number(f.govt_fee || 0);
  const srvFee = Number(f.service_fee || 0);
  const total = govtFee + srvFee;
  const paid = Number(f.paid || 0);
  const remaining = total - paid;

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <IconFileText size={24} className="text-primary" />
            {id ? 'दाखला अर्ज माहिती बदला' : 'नवीन दाखला अर्ज नोंदणी'}
          </h2>
          <p className="page-subtitle">अर्जदाराची सेवा निवड, शासकीय फी व कागदपत्रे जोडा</p>
        </div>
      </div>

      <Notice notice={n.notice} />

      <div className="card">
        <form onSubmit={submit}>
          <div className="row">
            <Field label="ग्राहक निवडा" required>
              <select value={f.customer_id} onChange={set('customer_id')} required>
                <option value="">ग्राहकाचे नाव निवडा…</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.mobile || 'No mobile'}) - {c.village || 'गाव नाही'}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="सेवा निवडा (Service)" required>
              <select value={f.service_id} onChange={set('service_id')} required>
                <option value="">दाखला किंवा सेवा निवडा…</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.department || 'सेवा'})
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="row">
            <Field label="अर्ज क्रमांक (Application No)">
              <input
                value={f.app_no}
                onChange={set('app_no')}
                placeholder="उदा. AAPLE-2026-98765"
              />
            </Field>

            <Field label="अर्ज दाखल तारीख">
              <input type="date" value={f.applied} onChange={set('applied')} required />
            </Field>

            <Field label="सध्याची स्थिती (Status)">
              <select value={f.status} onChange={set('status')}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="दाखला मिळाल्याची तारीख">
              <input type="date" value={f.delivery} onChange={set('delivery')} />
            </Field>
          </div>

          {/* Fee Calculation Section */}
          <div
            className="card"
            style={{
              background: '#f8fafc',
              borderColor: '#e2e8f0',
              padding: '16px 20px',
              margin: '16px 0'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--slate-800)', marginBottom: 12 }}>
              💰 फी आणि पेमेंट हिशोब
            </div>
            <div className="row">
              <Field label="सरकारी फी (₹)">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={f.govt_fee}
                  onChange={set('govt_fee')}
                />
              </Field>

              <Field label="कार्यालयीन सेवा शुल्क (₹)">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={f.service_fee}
                  onChange={set('service_fee')}
                />
              </Field>

              <Field label="मिळालेले पैसे (₹)">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={f.paid}
                  onChange={set('paid')}
                />
              </Field>

              <Field label="एकूण फी / बाकी येणे">
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#ffffff',
                    border: '1px solid var(--slate-300)',
                    fontWeight: 700,
                    fontSize: 14,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>एकूण: ₹{total.toFixed(2)}</span>
                  <span style={{ color: remaining > 0 ? 'var(--rose-600)' : 'var(--emerald-600)' }}>
                    बाकी: ₹{remaining.toFixed(2)}
                  </span>
                </div>
              </Field>
            </div>

            {!id && (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 12,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: 'var(--slate-800)'
                }}
              >
                <input
                  type="checkbox"
                  checked={recordIncome}
                  onChange={(e) => setRecordIncome(e.target.checked)}
                />
                मिळालेली रक्कम "जमा-खर्च" मध्ये आपोआप जमा (Income) म्हणून नोंदवा
              </label>
            )}
          </div>

          <Field label="कागदपत्र PDF किंवा फोटो (कमाल 15 MB)">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
            {existing?.file_name && (
              <div style={{ marginTop: 8, fontSize: 13, color: 'var(--slate-600)' }}>
                <span>सध्या जोडलेली फाईल: </span>
                <button
                  type="button"
                  className="btn small secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  onClick={() =>
                    download(`/applications/${id}/file`, existing.file_original || 'file').catch(n.err)
                  }
                >
                  <IconPaperclip size={14} /> {existing.file_original}
                </button>
                <span className="muted" style={{ marginLeft: 8 }}>
                  (नवीन फाईल निवडल्यास जुनी फाईल बदलेल)
                </span>
              </div>
            )}
          </Field>

          <Field label="विशेष नोंदी (Notes)">
            <textarea
              value={f.notes}
              onChange={set('notes')}
              placeholder="कागदपत्रांची पूर्तता किंवा इतर नोंदी…"
              rows={2}
            />
          </Field>

          <div className="actions" style={{ marginTop: 24 }}>
            <button type="submit" disabled={busy}>
              <IconCheck size={16} />
              {busy ? 'सेव्ह करत आहे…' : id ? 'बदल सेव्ह करा' : 'दाखला अर्ज सेव्ह करा'}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => nav('/applications')}
            >
              <IconX size={16} /> रद्द करा
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
