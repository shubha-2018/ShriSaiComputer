import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money, download } from '../api.js';
import { useAuth } from '../auth.jsx';
import { STATUSES, StatusTag, useNotice, Notice, confirmDelete, EmptyState } from '../ui.jsx';
import {
  IconFileText,
  IconPlus,
  IconSearch,
  IconPaperclip,
  IconEdit,
  IconTrash
} from '../components/Icons.jsx';

export default function Applications() {
  const { isAdmin } = useAuth();
  const [rows, setRows] = useState(null);
  const [qs, setQs] = useState('');
  const [status, setStatus] = useState('');
  const n = useNotice();

  const load = () =>
    api
      .get(`/applications?q=${encodeURIComponent(qs)}&status=${encodeURIComponent(status)}`)
      .then(setRows)
      .catch(n.err);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [qs, status]); // eslint-disable-line

  const remove = async (a) => {
    if (!confirmDelete(`दाखला अर्ज: ${a.customer} - ${a.service}`)) return;
    try {
      await api.del(`/applications/${a.id}`);
      n.ok('अर्ज यशस्वीरीत्या काढून टाकला.');
      load();
    } catch (e) {
      n.err(e);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <IconFileText size={24} className="text-primary" />
            दाखला अर्ज नोंदवही / Applications
          </h2>
          <p className="page-subtitle">सर्व शासकीय दाखले व प्रमाणपत्रांचे अर्ज ट्रॅकिंग</p>
        </div>
        <Link className="btn" to="/applications/new">
          <IconPlus size={16} /> + नवीन अर्ज भरा
        </Link>
      </div>

      <Notice notice={n.notice} />

      <div className="card">
        <div className="toolbar">
          <div className="form-field" style={{ margin: 0, flex: 2, minWidth: 240 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                placeholder="ग्राहक, मोबाईल, अर्ज क्र. किंवा सेवा शोधा…"
                value={qs}
                onChange={(e) => setQs(e.target.value)}
                style={{ paddingLeft: 38 }}
              />
              <span style={{ position: 'absolute', left: 12, color: 'var(--slate-400)', pointerEvents: 'none' }}>
                <IconSearch size={18} />
              </span>
            </div>
          </div>

          <div className="form-field" style={{ margin: 0, flex: 1, minWidth: 180, maxWidth: 240 }}>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">सर्व स्थिती (All Status)</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {rows && (
            <div style={{ alignSelf: 'center', fontSize: 13, color: 'var(--slate-500)', fontWeight: 600 }}>
              एकूण: {rows.length} अर्ज
            </div>
          )}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ग्राहक नाव</th>
                <th>सेवा (Certificate)</th>
                <th>अर्ज क्रमांक</th>
                <th>तारीख</th>
                <th>स्थिती</th>
                <th className="num">एकूण फी</th>
                <th className="num">बाकी रक्कम</th>
                <th style={{ textAlign: 'right' }}>कृती</th>
              </tr>
            </thead>
            <tbody>
              {(rows || []).map((a) => {
                const fee = a.govt_fee + a.service_fee;
                const due = fee - a.paid;
                return (
                  <tr key={a.id}>
                    <td>
                      <Link to={`/customers/${a.customer_id}`} style={{ fontWeight: 600 }}>
                        {a.customer}
                      </Link>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {a.mobile}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{a.service}</span>
                    </td>
                    <td>{a.app_no || <span className="muted">—</span>}</td>
                    <td>{a.applied || <span className="muted">—</span>}</td>
                    <td>
                      <StatusTag status={a.status} />
                    </td>
                    <td className="num">{money(fee)}</td>
                    <td className="num" style={{ color: due > 0 ? 'var(--rose-600)' : 'var(--emerald-600)' }}>
                      {money(due)}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                        {a.file_name && (
                          <button
                            type="button"
                            className="btn small secondary"
                            title={`कागदपत्र डाउनलोड: ${a.file_original || 'file'}`}
                            onClick={() =>
                              download(`/applications/${a.id}/file`, a.file_original || 'file').catch(n.err)
                            }
                          >
                            <IconPaperclip size={14} />
                          </button>
                        )}
                        <Link to={`/applications/${a.id}/edit`} className="btn small secondary">
                          <IconEdit size={14} /> बदला
                        </Link>
                        {isAdmin && (
                          <button
                            type="button"
                            className="btn small danger"
                            style={{ padding: '5px 8px' }}
                            title="काढून टाका"
                            onClick={() => remove(a)}
                          >
                            <IconTrash size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!rows && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: 30 }} className="muted">
                    अर्ज यादी लोड होत आहे…
                  </td>
                </tr>
              )}

              {rows && rows.length === 0 && (
                <tr>
                  <td colSpan="8">
                    <EmptyState
                      message="दिलेल्या निकषांनुसार कोणतेही अर्ज सापडले नाहीत."
                      action={
                        <Link className="btn small" to="/applications/new">
                          <IconPlus size={14} /> नवीन दाखला अर्ज भरा
                        </Link>
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
