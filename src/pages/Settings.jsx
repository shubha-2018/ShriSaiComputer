import React, { useState } from 'react';
import { api, download } from '../api.js';
import { useAuth } from '../auth.jsx';
import { useNotice, Notice, Field } from '../ui.jsx';
import { PwaInfoCard } from '../components/PwaInstallBanner.jsx';
import { IconSettings, IconDownload, IconCheck, IconShield } from '../components/Icons.jsx';

export default function Settings() {
  const { user, isAdmin } = useAuth();
  const n = useNotice();
  const [f, setF] = useState({ current: '', next: '', confirm: '' });
  const [busy, setBusy] = useState(false);

  const change = async (e) => {
    e.preventDefault();
    if (f.next !== f.confirm) {
      return n.err(new Error('नवीन पासवर्ड जुळत नाही (Passwords do not match)'));
    }
    setBusy(true);
    try {
      await api.put('/auth/password', { current: f.current, next: f.next });
      n.ok('पासवर्ड यशस्वीरीत्या बदलला.');
      setF({ current: '', next: '', confirm: '' });
    } catch (er) {
      n.err(er);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <IconSettings size={24} className="text-primary" />
            सेटिंग्ज व सिस्टीम / Settings
          </h2>
          <p className="page-subtitle">खाते सुरक्षा, डेटा बॅकअप व वेब ॲप (PWA) माहिती</p>
        </div>
      </div>

      <Notice notice={n.notice} />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
        {/* PWA App Info & Installation */}
        <PwaInfoCard />

        {/* Change Password Card */}
        <div className="card">
          <div className="card-title">
            <span>पासवर्ड बदला (Security)</span>
          </div>
          <div style={{ marginBottom: 14, fontSize: 13, color: 'var(--slate-600)' }}>
            सध्याचे लॉगिन: <b>{user.username}</b> ({user.role})
          </div>

          <form onSubmit={change}>
            <Field label="सध्याचा पासवर्ड" required>
              <input
                type="password"
                value={f.current}
                onChange={(e) => setF({ ...f, current: e.target.value })}
                required
                autoComplete="current-password"
                placeholder="सध्याचा पासवर्ड प्रविष्ट करा"
              />
            </Field>

            <Field label="नवीन पासवर्ड (किमान 10 अक्षरे)" required>
              <input
                type="password"
                value={f.next}
                onChange={(e) => setF({ ...f, next: e.target.value })}
                required
                minLength={10}
                autoComplete="new-password"
                placeholder="नवीन मजबूत पासवर्ड"
              />
            </Field>

            <Field label="पुन्हा नवीन पासवर्ड प्रविष्ट करा" required>
              <input
                type="password"
                value={f.confirm}
                onChange={(e) => setF({ ...f, confirm: e.target.value })}
                required
                autoComplete="new-password"
                placeholder="पासवर्डची खात्री करा"
              />
            </Field>

            <button type="submit" disabled={busy}>
              <IconCheck size={16} />
              {busy ? 'बदलत आहे…' : 'पासवर्ड सेव्ह करा'}
            </button>
          </form>
        </div>

        {/* Backup Card for Admin */}
        {isAdmin && (
          <div className="card">
            <div className="card-title">
              <span>डेटा बॅकअप (Full System Backup)</span>
              <IconShield size={20} className="text-primary" />
            </div>
            <p className="muted" style={{ fontSize: 14, margin: '0 0 16px', lineHeight: 1.6 }}>
              सर्व ग्राहक माहिती, दाखले अर्ज नोंदी, रोजचा जमा-खर्च आणि अपलोड केलेली कागदपत्रे ZIP स्वरूपात डाउनलोड करता येतात.
              ही ZIP फाईल तुमच्या पेनड्राईव्ह किंवा सुरक्षित कॉम्प्युटरवर सेव्ह करून ठेवा.
            </p>
            <button
              type="button"
              className="btn"
              onClick={() => download('/backup', 'ShreeSai_Backup.zip').catch(n.err)}
            >
              <IconDownload size={16} /> Full Backup ZIP डाउनलोड करा
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
