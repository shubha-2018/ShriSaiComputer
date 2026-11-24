import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money, download } from '../api.js';
import { StatusTag, useNotice, Notice, StatCard } from '../ui.jsx';
import {
  IconUsers,
  IconFileText,
  IconWallet,
  IconPlus,
  IconDownload,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertCircle
} from '../components/Icons.jsx';

export default function Dashboard() {
  const [d, setD] = useState(null);
  const n = useNotice();

  useEffect(() => {
    api.get('/dashboard').then(setD).catch(n.err);
  }, []); // eslint-disable-line

  if (!d) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <Notice notice={n.notice} />
        <p className="muted">डॅशबोर्ड माहिती लोड होत आहे…</p>
      </div>
    );
  }

  const max = Math.max(1, ...d.monthly.flatMap((m) => [m.income, m.expense]));
  const todayMarathi = new Date().toLocaleDateString('mr-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">डॅशबोर्ड / Dashboard</h2>
          <p className="page-subtitle">आजचा वार: {todayMarathi}</p>
        </div>
        <div className="actions" style={{ margin: 0 }}>
          <button
            type="button"
            className="secondary"
            onClick={() => download('/reports/excel', 'Shree_Sai_Report.xlsx').catch(n.err)}
          >
            <IconDownload size={16} /> Excel रिपोर्ट
          </button>
        </div>
      </div>

      <Notice notice={n.notice} />

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="एकूण जमा (Income)"
          value={money(d.income)}
          icon={IconTrendingUp}
          variant="green"
          subtitle="कार्यालयीन उत्पन्न"
        />
        <StatCard
          title="एकूण खर्च (Expense)"
          value={money(d.expense)}
          icon={IconTrendingDown}
          variant="red"
          subtitle="एकूण खर्च नोंदी"
        />
        <StatCard
          title="निव्वळ शिल्लक (Balance)"
          value={money(d.balance)}
          icon={IconWallet}
          variant="blue"
          subtitle="सध्या शिल्लक रक्कम"
        />
        <StatCard
          title="एकूण ग्राहक"
          value={d.customers}
          icon={IconUsers}
          variant="default"
          subtitle="नोंदणीकृत नागरिक"
        />
        <StatCard
          title="एकूण दाखला अर्ज"
          value={d.apps}
          icon={IconFileText}
          variant="default"
          subtitle="एकूण अर्ज प्रक्रिया"
        />
        <StatCard
          title="प्रलंबित अर्ज (Pending)"
          value={d.pending}
          icon={IconAlertCircle}
          variant={d.pending > 0 ? 'amber' : 'green'}
          subtitle={d.pending > 0 ? 'तातडीने पूर्ण करा' : 'सर्व अर्ज पूर्ण'}
        />
      </div>

      {/* Quick Actions Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontWeight: 700, color: 'var(--slate-800)', fontSize: 15 }}>
            ⚡ जलद कृती (Quick Actions):
          </span>
          <div className="actions" style={{ margin: 0 }}>
            <Link className="btn" to="/customers/new">
              <IconPlus size={16} /> + नवीन ग्राहक
            </Link>
            <Link className="btn" to="/applications/new">
              <IconPlus size={16} /> + नवीन दाखला अर्ज
            </Link>
            <Link className="btn secondary" to="/transactions">
              <IconWallet size={16} /> + जमा / खर्च नोंद
            </Link>
          </div>
        </div>
      </div>

      {/* Graphs and Pending Applications */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* Monthly Trend Chart */}
        <div className="card">
          <div className="card-title">
            <span>गेले 6 महिने जमा / खर्च</span>
            <div className="legend">
              <div><span style={{ background: 'var(--emerald-500)' }} />जमा</div>
              <div><span style={{ background: 'var(--rose-500)' }} />खर्च</div>
            </div>
          </div>

          {d.monthly.length === 0 ? (
            <p className="muted" style={{ padding: '24px 0', textAlign: 'center' }}>
              अजून मागील महिन्यांच्या नोंदी उपलब्ध नाहीत.
            </p>
          ) : (
            <div className="bars">
              {d.monthly.map((m) => (
                <div className="bar-col" key={m.month}>
                  <div className="bar-pair">
                    <div
                      className="bar i"
                      title={`जमा: ${money(m.income)}`}
                      style={{ height: `${Math.max(4, (m.income / max) * 130)}px` }}
                    />
                    <div
                      className="bar e"
                      title={`खर्च: ${money(m.expense)}`}
                      style={{ height: `${Math.max(4, (m.expense / max) * 130)}px` }}
                    />
                  </div>
                  <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>
                    {m.month.slice(5)}/{m.month.slice(2, 4)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Applications List */}
        <div className="card">
          <div className="card-title">
            <span>प्रलंबित दाखला अर्ज</span>
            <Link to="/applications" style={{ fontSize: 13 }}>
              सर्व अर्ज पाहा →
            </Link>
          </div>

          {d.recentApps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 12px' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--emerald-700)' }}>
                सर्व कामे पूर्ण! सध्या कोणतेही अर्ज प्रलंबित नाहीत.
              </p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ग्राहक व सेवा</th>
                    <th>स्थिती</th>
                    <th>कृती</th>
                  </tr>
                </thead>
                <tbody>
                  {d.recentApps.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <Link to={`/applications/${a.id}/edit`} style={{ fontWeight: 600 }}>
                          {a.customer}
                        </Link>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {a.service}
                        </div>
                      </td>
                      <td>
                        <StatusTag status={a.status} />
                      </td>
                      <td>
                        <Link to={`/applications/${a.id}/edit`} className="btn small secondary">
                          बदला
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
