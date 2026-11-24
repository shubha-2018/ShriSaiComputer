import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useNotice, Notice, Avatar, EmptyState } from '../ui.jsx';
import { IconUsers, IconPlus, IconSearch, IconPhone, IconMapPin } from '../components/Icons.jsx';

export default function Customers() {
  const [rows, setRows] = useState(null);
  const [qs, setQs] = useState('');
  const n = useNotice();

  useEffect(() => {
    const t = setTimeout(
      () => api.get(`/customers?q=${encodeURIComponent(qs)}`).then(setRows).catch(n.err),
      250
    );
    return () => clearTimeout(t);
  }, [qs]); // eslint-disable-line

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <IconUsers size={24} className="text-primary" />
            ग्राहक नोंदवही / Customers
          </h2>
          <p className="page-subtitle">कार्यालयात येणाऱ्या सर्व ग्राहकांची माहिती व इतिहास</p>
        </div>
        <Link className="btn" to="/customers/new">
          <IconPlus size={16} /> + नवीन ग्राहक नोंदणी
        </Link>
      </div>

      <Notice notice={n.notice} />

      <div className="card">
        <div className="toolbar">
          <div className="form-field" style={{ margin: 0, flex: 1, minWidth: 260 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                placeholder="नाव, मोबाईल नंबर किंवा गाव शोधा…"
                value={qs}
                onChange={(e) => setQs(e.target.value)}
                style={{ paddingLeft: 38 }}
              />
              <span style={{ position: 'absolute', left: 12, color: 'var(--slate-400)', pointerEvents: 'none' }}>
                <IconSearch size={18} />
              </span>
            </div>
          </div>
          {rows && (
            <div style={{ alignSelf: 'center', fontSize: 13, color: 'var(--slate-500)', fontWeight: 600 }}>
              एकूण: {rows.length} ग्राहक
            </div>
          )}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ग्राहक नाव</th>
                <th>संपर्क क्रमांक</th>
                <th>गाव / पत्ता</th>
                <th style={{ textAlign: 'center' }}>एकूण अर्ज</th>
                <th style={{ textAlign: 'right' }}>कृती</th>
              </tr>
            </thead>
            <tbody>
              {(rows || []).map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={c.name} size={34} />
                      <div>
                        <Link to={`/customers/${c.id}`} style={{ fontWeight: 600, fontSize: 15 }}>
                          {c.name}
                        </Link>
                        {c.notes && (
                          <div className="muted" style={{ fontSize: 12, maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {c.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    {c.mobile ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <IconPhone size={14} className="muted" />
                        <a href={`tel:${c.mobile}`} style={{ color: 'var(--slate-700)', fontWeight: 500 }}>
                          {c.mobile}
                        </a>
                      </div>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>
                    {c.village ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <IconMapPin size={14} className="muted" />
                        <span>{c.village}</span>
                      </div>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="tag" style={{ background: '#eff6ff', color: '#1d4ed8', fontWeight: 700 }}>
                      {c.app_count} अर्ज
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <Link to={`/customers/${c.id}`} className="btn small secondary">
                      तपशील / History →
                    </Link>
                  </td>
                </tr>
              ))}

              {!rows && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 30 }}>
                    <div className="muted">ग्राहक यादी लोड होत आहे…</div>
                  </td>
                </tr>
              )}

              {rows && rows.length === 0 && (
                <tr>
                  <td colSpan="5">
                    <EmptyState
                      message="दिलेल्या माहितीनुसार ग्राहक सापडले नाहीत."
                      action={
                        <Link className="btn small" to="/customers/new">
                          <IconPlus size={14} /> नवीन ग्राहक जोडा
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
