import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, money, download } from '../api.js';
import { useAuth } from '../auth.jsx';
import { StatusTag, useNotice, Notice, confirmDelete, Avatar, StatCard } from '../ui.jsx';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconPhone,
  IconMapPin,
  IconFileText,
  IconWallet,
  IconPaperclip
} from '../components/Icons.jsx';

export default function CustomerDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { isAdmin } = useAuth();
  const [c, setC] = useState(null);
  const n = useNotice();

  useEffect(() => {
    api.get(`/customers/${id}`).then(setC).catch(n.err);
  }, [id]); // eslint-disable-line

  const remove = async () => {
    if (!confirmDelete(`ग्राहक: ${c.name}`)) return;
    try {
      await api.del(`/customers/${id}`);
      nav('/customers');
    } catch (e) {
      n.err(e);
    }
  };

  if (!c) {
    return (
      <div className="card" style={{ padding: 40, textAlign: 'center' }}>
        <Notice notice={n.notice} />
        <p className="muted">ग्राहक माहिती लोड होत आहे…</p>
      </div>
    );
  }

  const totalFee = c.applications.reduce((s, a) => s + a.govt_fee + a.service_fee, 0);
  const totalPaid = c.applications.reduce((s, a) => s + a.paid, 0);
  const balanceDue = totalFee - totalPaid;

  const cleanPhone = (c.mobile || '').replace(/\D/g, '');

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name={c.name} size={48} />
          <div>
            <h2 className="page-title" style={{ margin: 0 }}>
              {c.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
              {c.mobile && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--slate-600)' }}>
                  <IconPhone size={14} />
                  <a href={`tel:${c.mobile}`}>{c.mobile}</a>
                  {c.alt_mobile && <span> / <a href={`tel:${c.alt_mobile}`}>{c.alt_mobile}</a></span>}
                </span>
              )}
              {c.village && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--slate-600)' }}>
                  <IconMapPin size={14} /> {c.village}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="actions" style={{ margin: 0 }}>
          <Link className="btn" to={`/applications/new?customer=${c.id}`}>
            <IconPlus size={16} /> + नवीन अर्ज
          </Link>
          {cleanPhone.length >= 10 && (
            <a
              href={`https://wa.me/91${cleanPhone.slice(-10)}`}
              target="_blank"
              rel="noreferrer"
              className="btn secondary"
              style={{ background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}
            >
              💬 WhatsApp
            </a>
          )}
          <Link className="btn secondary" to={`/customers/${c.id}/edit`}>
            <IconEdit size={15} /> बदला
          </Link>
          {isAdmin && (
            <button className="danger" onClick={remove}>
              <IconTrash size={15} /> Delete
            </button>
          )}
        </div>
      </div>

      <Notice notice={n.notice} />

      {/* Financial Summary for this customer */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <StatCard
          title="एकूण अर्ज फी"
          value={money(totalFee)}
          icon={IconFileText}
          variant="default"
          subtitle={`${c.applications.length} अर्ज नोंद`}
        />
        <StatCard
          title="जमा रक्कम"
          value={money(totalPaid)}
          icon={IconWallet}
          variant="green"
          subtitle="प्राप्त झालेली रक्कम"
        />
        <StatCard
          title="शिल्लक बाकी"
          value={money(balanceDue)}
          variant={balanceDue > 0 ? 'red' : 'green'}
          subtitle={balanceDue > 0 ? 'ग्राहकाकडून येणे बाकी' : 'सर्व रक्कम भरली आहे'}
        />
      </div>

      {c.address && (
        <div className="card" style={{ padding: '14px 20px', marginBottom: 16 }}>
          <span style={{ fontWeight: 600, color: 'var(--slate-700)', fontSize: 13 }}>पत्ता: </span>
          <span>{c.address}</span>
        </div>
      )}

      {c.notes && (
        <div className="card" style={{ padding: '14px 20px', marginBottom: 16 }}>
          <span style={{ fontWeight: 600, color: 'var(--slate-700)', fontSize: 13 }}>नोंदी: </span>
          <span className="muted">{c.notes}</span>
        </div>
      )}

      {/* Applications History */}
      <div className="card">
        <div className="card-title">
          <span>दाखला अर्ज इतिहास (Applications History)</span>
          <Link to={`/applications/new?customer=${c.id}`} className="btn small">
            <IconPlus size={14} /> + या ग्राहकाचा नवीन अर्ज
          </Link>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>सेवा (Service)</th>
                <th>अर्ज क्रमांक</th>
                <th>अर्ज तारीख</th>
                <th>स्थिती</th>
                <th className="num">एकूण फी</th>
                <th className="num">जमा</th>
                <th style={{ textAlign: 'right' }}>कागदपत्र / कृती</th>
              </tr>
            </thead>
            <tbody>
              {c.applications.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link to={`/applications/${a.id}/edit`} style={{ fontWeight: 600 }}>
                      {a.service}
                    </Link>
                  </td>
                  <td>{a.app_no || <span className="muted">—</span>}</td>
                  <td>{a.applied || <span className="muted">—</span>}</td>
                  <td>
                    <StatusTag status={a.status} />
                  </td>
                  <td className="num">{money(a.govt_fee + a.service_fee)}</td>
                  <td className="num">{money(a.paid)}</td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                      {a.file_name && (
                        <button
                          type="button"
                          className="btn small secondary"
                          title={a.file_original || 'कागदपत्र'}
                          onClick={() => download(`/applications/${a.id}/file`, a.file_original || 'file').catch(n.err)}
                        >
                          <IconPaperclip size={14} /> फाईल
                        </button>
                      )}
                      <Link to={`/applications/${a.id}/edit`} className="btn small secondary">
                        <IconEdit size={14} /> बदला
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {!c.applications.length && (
                <tr>
                  <td colSpan="7" className="muted" style={{ textAlign: 'center', padding: 24 }}>
                    अजून कोणतेही अर्ज नोंदवलेले नाहीत.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transactions History */}
      {c.transactions.length > 0 && (
        <div className="card">
          <div className="card-title">
            <span>या ग्राहकाशी संबंधित जमा-खर्च</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>तारीख</th>
                  <th>प्रकार</th>
                  <th>कारण / वर्ग</th>
                  <th className="num">रक्कम</th>
                </tr>
              </thead>
              <tbody>
                {c.transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td>
                      <span className={`tag ${t.kind.toLowerCase()}`}>
                        {t.kind === 'Income' ? 'जमा' : 'खर्च'}
                      </span>
                    </td>
                    <td>{t.category}</td>
                    <td className="num">{money(t.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
