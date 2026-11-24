import React, { useEffect, useState } from 'react';
import { api, money, download, todayStr } from '../api.js';
import { useAuth } from '../auth.jsx';
import { METHODS, useNotice, Notice, Field, confirmDelete, StatCard, EmptyState } from '../ui.jsx';
import {
  IconWallet,
  IconDownload,
  IconPrinter,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconTrendingUp,
  IconTrendingDown
} from '../components/Icons.jsx';

const blank = () => ({
  kind: 'Income',
  category: '',
  amount: '',
  date: todayStr(),
  method: 'Cash',
  party: '',
  customer_id: '',
  description: ''
});

export default function Transactions() {
  const { isAdmin } = useAuth();
  const n = useNotice();
  const [data, setData] = useState({ rows: [], totals: { income: 0, expense: 0, balance: 0 } });
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState({ from: '', to: '', kind: '', q: '' });
  const [f, setF] = useState(blank());
  const [editId, setEditId] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const qstr = () =>
    new URLSearchParams(Object.fromEntries(Object.entries(filter).filter(([, v]) => v))).toString();

  const load = () => api.get(`/transactions?${qstr()}`).then(setData).catch(n.err);

  useEffect(() => {
    api.get('/customers').then(setCustomers).catch(n.err);
  }, []); // eslint-disable-line

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [filter]); // eslint-disable-line

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editId) {
        await api.put(`/transactions/${editId}`, f);
      } else {
        await api.post('/transactions', f);
      }
      n.ok(editId ? 'व्यवहार नोंद यशस्वीरीत्या बदलली.' : 'नवीन व्यवहार नोंद सेव्ह झाली.');
      setF(blank());
      setEditId(null);
      load();
    } catch (err) {
      n.err(err);
    } finally {
      setBusy(false);
    }
  };

  const edit = (t) => {
    setEditId(t.id);
    setF({
      kind: t.kind,
      category: t.category,
      amount: t.amount,
      date: t.date,
      method: t.method,
      party: t.party || '',
      customer_id: t.customer_id || '',
      description: t.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (t) => {
    if (!confirmDelete(`${t.date} ${t.category} ${money(t.amount)}`)) return;
    try {
      await api.del(`/transactions/${t.id}`);
      n.ok('व्यवहार नोंद काढून टाकली.');
      load();
    } catch (e) {
      n.err(e);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <IconWallet size={24} className="text-primary" />
            जमा-खर्च नोंदवही / Daily Ledger
          </h2>
          <p className="page-subtitle">रोजचे कार्यालयीन उत्पन्न, खर्च व शिल्लक ताळेबंद</p>
        </div>
        <div className="actions no-print" style={{ margin: 0 }}>
          <button
            type="button"
            className="secondary"
            onClick={() => download(`/reports/excel?${qstr()}`, 'Shree_Sai_Report.xlsx').catch(n.err)}
          >
            <IconDownload size={16} /> Excel Export
          </button>
          <button type="button" className="secondary" onClick={() => window.print()}>
            <IconPrinter size={16} /> Print / PDF
          </button>
        </div>
      </div>

      <Notice notice={n.notice} />

      {/* Transaction Entry / Edit Form */}
      <div className="card no-print" style={{ borderTop: `4px solid ${f.kind === 'Income' ? 'var(--emerald-500)' : 'var(--rose-500)'}` }}>
        <div className="card-title">
          <span>{editId ? 'व्यवहार माहिती बदला' : 'नवीन जमा / खर्च नोंद'}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className={`btn small ${f.kind === 'Income' ? '' : 'secondary'}`}
              style={f.kind === 'Income' ? { background: 'var(--emerald-600)', borderColor: 'var(--emerald-700)' } : {}}
              onClick={() => setF({ ...f, kind: 'Income' })}
            >
              + जमा (Income)
            </button>
            <button
              type="button"
              className={`btn small ${f.kind === 'Expense' ? 'danger' : 'secondary'}`}
              onClick={() => setF({ ...f, kind: 'Expense' })}
            >
              - खर्च (Expense)
            </button>
          </div>
        </div>

        <form onSubmit={submit}>
          <div className="row">
            <Field label="प्रकार (Kind)" required>
              <select value={f.kind} onChange={set('kind')}>
                <option value="Income">जमा (Income)</option>
                <option value="Expense">खर्च (Expense)</option>
              </select>
            </Field>

            <Field label="तारीख (Date)" required>
              <input type="date" value={f.date} onChange={set('date')} required />
            </Field>

            <Field label="रक्कम (₹ Amount)" required>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={f.amount}
                onChange={set('amount')}
                placeholder="उदा. 500"
                required
              />
            </Field>

            <Field label="पेमेंट पद्धत">
              <select value={f.method} onChange={set('method')}>
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="row">
            <Field label="वर्ग / कारण (Category) *" required>
              <input
                value={f.category}
                onChange={set('category')}
                placeholder="उदा. दाखला फी, झेरॉक्स, स्टेशनरी, वीज बिल, चहा-नाश्ता"
                required
                maxLength={120}
              />
            </Field>

            <Field label="व्यक्ती (कोणाकडून / कोणाला)">
              <input
                value={f.party}
                onChange={set('party')}
                placeholder="व्यक्ती किंवा दुकानाचे नाव"
                maxLength={150}
              />
            </Field>

            <Field label="ग्राहक जोडणी (ऐच्छिक)">
              <select value={f.customer_id} onChange={set('customer_id')}>
                <option value="">ग्राहक निवडा (नसल्यास रिकामे ठेवा)</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.mobile}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="सविस्तर तपशील (Description)">
            <textarea
              value={f.description}
              onChange={set('description')}
              placeholder="काही विशेष तपशील किंवा पावती क्रमांक…"
              rows={2}
            />
          </Field>

          <div className="actions">
            <button type="submit" disabled={busy}>
              <IconCheck size={16} />
              {editId ? 'बदल सेव्ह करा' : 'व्यवहार नोंद सेव्ह करा'}
            </button>
            {editId && (
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setEditId(null);
                  setF(blank());
                }}
              >
                <IconX size={16} /> रद्द करा
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Register List & Financial Totals */}
      <div className="card">
        {/* Filter Toolbar */}
        <div className="toolbar no-print">
          <Field label="या तारखेपासून">
            <input
              type="date"
              value={filter.from}
              onChange={(e) => setFilter({ ...filter, from: e.target.value })}
            />
          </Field>
          <Field label="या तारखेपर्यंत">
            <input
              type="date"
              value={filter.to}
              onChange={(e) => setFilter({ ...filter, to: e.target.value })}
            />
          </Field>
          <Field label="प्रकार">
            <select
              value={filter.kind}
              onChange={(e) => setFilter({ ...filter, kind: e.target.value })}
            >
              <option value="">सर्व व्यवहार (All)</option>
              <option value="Income">फक्त जमा (Income)</option>
              <option value="Expense">फक्त खर्च (Expense)</option>
            </select>
          </Field>
          <Field label="शोधा">
            <input
              value={filter.q}
              onChange={(e) => setFilter({ ...filter, q: e.target.value })}
              placeholder="कारण किंवा व्यक्तीचे नाव शोधा…"
            />
          </Field>
        </div>

        {/* Totals Summary */}
        <div className="stats-grid" style={{ margin: '16px 0' }}>
          <StatCard
            title="एकूण जमा (Income)"
            value={money(data.totals.income)}
            icon={IconTrendingUp}
            variant="green"
            subtitle="निवडलेल्या कालावधीत"
          />
          <StatCard
            title="एकूण खर्च (Expense)"
            value={money(data.totals.expense)}
            icon={IconTrendingDown}
            variant="red"
            subtitle="निवडलेल्या कालावधीत"
          />
          <StatCard
            title="निव्वळ शिल्लक (Net Balance)"
            value={money(data.totals.balance)}
            icon={IconWallet}
            variant={data.totals.balance >= 0 ? 'blue' : 'red'}
            subtitle="शिल्लक रक्कम"
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>तारीख</th>
                <th>प्रकार</th>
                <th>वर्ग / कारण</th>
                <th className="num">रक्कम (₹)</th>
                <th>पद्धत</th>
                <th>व्यक्ती / ग्राहक</th>
                <th>नोंदणी</th>
                {isAdmin && <th className="no-print" style={{ textAlign: 'right' }}>कृती</th>}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>
                    <span className={`tag ${t.kind.toLowerCase()}`}>
                      {t.kind === 'Income' ? '+ जमा' : '- खर्च'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{t.category}</span>
                    {t.description && <div className="muted" style={{ fontSize: 12 }}>{t.description}</div>}
                  </td>
                  <td
                    className="num"
                    style={{
                      fontWeight: 700,
                      color: t.kind === 'Income' ? 'var(--emerald-600)' : 'var(--rose-600)'
                    }}
                  >
                    {money(t.amount)}
                  </td>
                  <td>
                    <span className="tag" style={{ background: '#f1f5f9', color: '#475569' }}>
                      {t.method}
                    </span>
                  </td>
                  <td>{t.party || t.customer || <span className="muted">—</span>}</td>
                  <td className="muted" style={{ fontSize: 12 }}>{t.created_by}</td>
                  {isAdmin && (
                    <td className="no-print" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className="btn small secondary"
                        style={{ padding: '4px 8px', marginRight: 6 }}
                        onClick={() => edit(t)}
                        title="माहिती बदला"
                      >
                        <IconEdit size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn small danger"
                        style={{ padding: '4px 8px' }}
                        onClick={() => remove(t)}
                        title="काढून टाका"
                      >
                        <IconTrash size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}

              {!data.rows.length && (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7}>
                    <EmptyState message="या निकषांनुसार कोणतेही व्यवहार सापडले नाहीत." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 14, fontSize: 13, color: 'var(--slate-500)', display: 'flex', justifyContent: 'space-between' }}>
          <span>{data.rows.length} नोंदी दाखवल्या आहेत.</span>
          <span>श्री साई कॉम्प्युटर · अधिकृत लेजर</span>
        </div>
      </div>
    </>
  );
}
