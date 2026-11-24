import React, { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { useNotice, Notice, confirmDelete, EmptyState } from '../ui.jsx';
import { IconList, IconPlus, IconEdit, IconTrash, IconCheck, IconX } from '../components/Icons.jsx';

export default function Services() {
  const { isAdmin } = useAuth();
  const n = useNotice();
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ name: '', department: '' });
  const [edit, setEdit] = useState(null);

  const load = () => api.get('/services').then(setRows).catch(n.err);
  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  const add = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services', f);
      n.ok('नवीन सेवा यशस्वीरीत्या जोडली.');
      setF({ name: '', department: '' });
      load();
    } catch (er) {
      n.err(er);
    }
  };

  const save = async () => {
    try {
      await api.put(`/services/${edit.id}`, edit);
      setEdit(null);
      n.ok('सेवा माहिती बदलली.');
      load();
    } catch (er) {
      n.err(er);
    }
  };

  const remove = async (s) => {
    if (!confirmDelete(`सेवा: ${s.name}`)) return;
    try {
      await api.del(`/services/${s.id}`);
      n.ok('सेवा काढून टाकली.');
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
            <IconList size={24} className="text-primary" />
            सेवा यादी / Service Catalogue
          </h2>
          <p className="page-subtitle">कार्यालयात उपलब्ध असलेल्या सर्व दाखले व नागरिक सेवा</p>
        </div>
      </div>

      <Notice notice={n.notice} />

      {/* Add New Service Form */}
      <div className="card">
        <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700 }}>+ नवीन सेवा जोडा</h3>
        <form onSubmit={add}>
          <div className="row">
            <div className="form-field" style={{ margin: 0, flex: 2 }}>
              <input
                placeholder="नवीन सेवेचे नाव (उदा. अधिवास दाखला, रेशन कार्ड दुरुस्ती)"
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
                required
              />
            </div>
            <div className="form-field" style={{ margin: 0, flex: 1 }}>
              <input
                placeholder="विभाग (उदा. महसूल, आपले सरकार, अन्न धान्य)"
                value={f.department}
                onChange={(e) => setF({ ...f, department: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button type="submit" style={{ whiteSpace: 'nowrap' }}>
                <IconPlus size={16} /> सेवा जोडा
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Services List Table */}
      <div className="card">
        <div className="card-title">
          <span>उपलब्ध सेवा यादी ({rows.length})</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 60 }}>क्र.</th>
                <th>सेवेचे नाव (Service Name)</th>
                <th>शासकीय विभाग (Department)</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>कृती</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((s, idx) => (
                <tr key={s.id}>
                  <td className="muted">{idx + 1}</td>
                  {edit?.id === s.id ? (
                    <>
                      <td>
                        <input
                          value={edit.name}
                          onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                          required
                        />
                      </td>
                      <td>
                        <input
                          value={edit.department || ''}
                          onChange={(e) => setEdit({ ...edit, department: e.target.value })}
                        />
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button className="small" onClick={save} style={{ marginRight: 6 }}>
                          <IconCheck size={14} /> Save
                        </button>
                        <button className="small secondary" onClick={() => setEdit(null)}>
                          <IconX size={14} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td>
                        <span className="tag" style={{ background: '#f1f5f9', color: '#334155' }}>
                          {s.department || 'सामान्य सेवा'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            type="button"
                            className="btn small secondary"
                            style={{ marginRight: 6 }}
                            onClick={() => setEdit({ ...s })}
                            title="बदला"
                          >
                            <IconEdit size={14} /> बदला
                          </button>
                          <button
                            type="button"
                            className="btn small danger"
                            onClick={() => remove(s)}
                            title="काढून टाका"
                          >
                            <IconTrash size={14} />
                          </button>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}

              {!rows.length && (
                <tr>
                  <td colSpan={isAdmin ? 4 : 3}>
                    <EmptyState message="अद्याप कोणतीही सेवा जोडलेली नाही." />
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
