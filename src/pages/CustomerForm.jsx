import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useNotice, Notice, Field } from '../ui.jsx';
import { IconUsers, IconCheck, IconX } from '../components/Icons.jsx';

const empty = {
  name: '',
  mobile: '',
  alt_mobile: '',
  village: '',
  address: '',
  notes: ''
};

export default function CustomerForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const n = useNotice();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    if (id) {
      api
        .get(`/customers/${id}`)
        .then((c) =>
          setF({
            ...empty,
            ...Object.fromEntries(Object.keys(empty).map((k) => [k, c[k] ?? '']))
          })
        )
        .catch(n.err);
    }
  }, [id]); // eslint-disable-line

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (id) {
        await api.put(`/customers/${id}`, f);
        nav(`/customers/${id}`);
      } else {
        const r = await api.post('/customers', f);
        nav(`/customers/${r.id}`);
      }
    } catch (err) {
      n.err(err);
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <IconUsers size={24} className="text-primary" />
            {id ? 'ग्राहक माहिती बदला' : 'नवीन ग्राहक नोंदणी'}
          </h2>
          <p className="page-subtitle">नागरिकांची संपर्क व पत्ता माहिती अचूक भरा</p>
        </div>
      </div>

      <Notice notice={n.notice} />

      <div className="card">
        <form onSubmit={submit}>
          <Field label="ग्राहकाचे पूर्ण नाव" required>
            <input
              value={f.name}
              onChange={set('name')}
              placeholder="उदा. राहुल प्रकाश पाटील"
              required
              autoFocus
            />
          </Field>

          <div className="row">
            <Field label="मोबाईल नंबर" required>
              <input
                value={f.mobile}
                onChange={set('mobile')}
                maxLength={15}
                inputMode="tel"
                placeholder="उदा. 98XXXXXXXX"
                required
              />
            </Field>

            <Field label="पर्यायी मोबाईल">
              <input
                value={f.alt_mobile}
                onChange={set('alt_mobile')}
                maxLength={15}
                inputMode="tel"
                placeholder="घरचा किंवा दुसरा नंबर"
              />
            </Field>

            <Field label="गाव / शहर">
              <input
                value={f.village}
                onChange={set('village')}
                placeholder="उदा. शिरपूर, धुळे"
              />
            </Field>
          </div>

          <Field label="पूर्ण पत्ता">
            <textarea
              value={f.address}
              onChange={set('address')}
              placeholder="घराचा पत्ता, गल्ली किंवा परिसर…"
              rows={2}
            />
          </Field>

          <Field label="नोंदी (Notes)">
            <textarea
              value={f.notes}
              onChange={set('notes')}
              placeholder="काही विशेष टीप किंवा संदर्भ…"
              rows={2}
            />
          </Field>

          <div
            className="card"
            style={{
              padding: 12,
              background: '#fffbeb',
              borderColor: '#fef3c7',
              color: '#92400e',
              fontSize: 13,
              marginBottom: 20
            }}
          >
            🛡️ <b>सुरक्षा सूचना:</b> आधार पूर्ण क्रमांक, OTP, बँक पासवर्ड किंवा संवेदनशील आर्थिक तपशील येथे साठवू नका.
          </div>

          <div className="actions">
            <button type="submit" disabled={busy}>
              <IconCheck size={16} />
              {busy ? 'सेव्ह करत आहे…' : id ? 'बदल सेव्ह करा' : 'ग्राहक सेव्ह करा'}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => nav(-1)}
            >
              <IconX size={16} /> रद्द करा
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
