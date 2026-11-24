import React, { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useNotice, Notice, Avatar, EmptyState } from '../ui.jsx';
import { IconShield, IconPlus, IconEdit, IconCheck, IconX } from '../components/Icons.jsx';

export default function Users() {
  const n = useNotice();
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ username: '', full_name: '', password: '', role: 'Staff' });
  const [edit, setEdit] = useState(null);

  const load = () => api.get('/users').then(setRows).catch(n.err);
  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  const add = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', f);
      n.ok('नवीन वापरकर्ता तयार झाला.');
      setF({ username: '', full_name: '', password: '', role: 'Staff' });
      load();
    } catch (er) {
      n.err(er);
    }
  };

  const save = async () => {
    try {
      await api.put(`/users/${edit.id}`, {
        full_name: edit.full_name,
        role: edit.role,
        active: edit.active,
        password: edit.password || undefined
      });
      setEdit(null);
      n.ok('वापरकर्ता तपशील सेव्ह झाले.');
      load();
    } catch (er) {
      n.err(er);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <IconShield size={24} className="text-primary" />
            वापरकर्ते व्यवस्थापन / User Management
          </h2>
          <p className="page-subtitle">कार्यालयीन कर्मचारी व ॲडमिन खात्यांचे व्यवस्थापन</p>
        </div>
      </div>

      <Notice notice={n.notice} />

      {/* Add User Form */}
      <div className="card">
        <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700 }}>
          <IconPlus size={16} /> नवीन वापरकर्ता जोडा (New Staff / Admin)
        </h3>
        <form onSubmit={add}>
          <div className="row">
            <div className="form-field">
              <label className="form-label">युझरनेम (Username) *</label>
              <input
                value={f.username}
                onChange={(e) => setF({ ...f, username: e.target.value })}
                placeholder="उदा. rohan123"
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">पूर्ण नाव (Full Name)</label>
              <input
                value={f.full_name}
                onChange={(e) => setF({ ...f, full_name: e.target.value })}
                placeholder="उदा. रोहन पाटील"
              />
            </div>
            <div className="form-field">
              <label className="form-label">पासवर्ड (किमान 10 अक्षरे) *</label>
              <input
                type="password"
                value={f.password}
                onChange={(e) => setF({ ...f, password: e.target.value })}
                minLength={10}
                placeholder="••••••••••••"
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">भूमिका (Role)</label>
              <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
                <option value="Staff">Staff (कर्मचारी)</option>
                <option value="Admin">Admin (व्यवस्थापक)</option>
              </select>
            </div>
          </div>
          <button type="submit">
            <IconPlus size={16} /> वापरकर्ता तयार करा
          </button>
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--slate-500)' }}>
            ℹ️ <b>Staff:</b> ग्राहक/अर्ज/जमा-खर्च नोंदवू शकतो. <b>Admin:</b> पूर्ण नियंत्रण, संपादन/रद्द करणे आणि बॅकअप.
          </div>
        </form>
      </div>

      {/* Users List */}
      <div className="card">
        <div className="card-title">
          <span>वापरकर्ते यादी ({rows.length})</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>वापरकर्ता</th>
                <th>पूर्ण नाव</th>
                <th>भूमिका (Role)</th>
                <th>स्थिती</th>
                <th style={{ textAlign: 'right' }}>कृती</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) =>
                edit?.id === u.id ? (
                  <tr key={u.id}>
                    <td>
                      <span style={{ fontWeight: 600 }}>{u.username}</span>
                    </td>
                    <td>
                      <input
                        value={edit.full_name || ''}
                        onChange={(e) => setEdit({ ...edit, full_name: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        value={edit.role}
                        onChange={(e) => setEdit({ ...edit, role: e.target.value })}
                      >
                        <option value="Staff">Staff</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="checkbox"
                          checked={!!edit.active}
                          onChange={(e) => setEdit({ ...edit, active: e.target.checked ? 1 : 0 })}
                        />
                        सक्रिय (Active)
                      </label>
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                        <input
                          type="password"
                          placeholder="नवीन पासवर्ड (ऐच्छिक)"
                          value={edit.password || ''}
                          onChange={(e) => setEdit({ ...edit, password: e.target.value })}
                          style={{ maxWidth: 180, fontSize: 12, padding: '6px 8px' }}
                        />
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="small" onClick={save}>
                            <IconCheck size={14} /> Save
                          </button>
                          <button className="small secondary" onClick={() => setEdit(null)}>
                            <IconX size={14} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={u.full_name || u.username} size={32} />
                        <span style={{ fontWeight: 600 }}>{u.username}</span>
                      </div>
                    </td>
                    <td>{u.full_name || <span className="muted">—</span>}</td>
                    <td>
                      <span
                        className="tag"
                        style={{
                          background: u.role === 'Admin' ? '#eff6ff' : '#f1f5f9',
                          color: u.role === 'Admin' ? '#1d4ed8' : '#475569',
                          fontWeight: 700
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${u.active ? 'status-done' : 'status-error'}`}>
                        <span className="status-dot" />
                        <span>{u.active ? 'सक्रिय' : 'बंद'}</span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn small secondary"
                        onClick={() => setEdit({ ...u })}
                      >
                        <IconEdit size={14} /> बदला
                      </button>
                    </td>
                  </tr>
                )
              )}

              {!rows.length && (
                <tr>
                  <td colSpan={5}>
                    <EmptyState message="कोणतेही वापरकर्ते नाहीत." />
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
