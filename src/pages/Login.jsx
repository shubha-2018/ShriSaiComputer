import React, { useState } from 'react';
import { useAuth } from '../auth.jsx';
import { MOCK } from '../api.js';
import { IconCheck, IconAlertCircle, IconSmartphone } from '../components/Icons.jsx';

export default function Login() {
  const { login } = useAuth();
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(err.message || 'लॉगिन अयशस्वी झाले. कृपया नाव आणि पासवर्ड तपासा.');
    } finally {
      setBusy(false);
    }
  };

  const fillDemo = (u, p) => {
    setU(u);
    setP(p);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo-wrap">
          <div className="brand-logo-badge" style={{ width: 56, height: 56, fontSize: 24, marginBottom: 12 }}>
            SS
          </div>
          <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>
            SHREE SAI COMPUTER
          </h2>
          <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
            Sales & Services · कार्यालयीन व्यवस्थापन पोर्टल
          </span>
        </div>

        {MOCK && (
          <div
            className="card"
            style={{
              padding: 12,
              background: '#eff6ff',
              borderColor: '#bfdbfe',
              borderRadius: 10,
              marginBottom: 20
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1e40af', marginBottom: 6 }}>
              ✨ डेमो क्रेडेंशियल्स (त्वरित भरण्यासाठी क्लिक करा):
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn small secondary"
                style={{ fontSize: 12, padding: '4px 8px' }}
                onClick={() => fillDemo('admin', 'ChangeMe123!')}
              >
                Admin (पूर्ण ॲक्सेस)
              </button>
              <button
                type="button"
                className="btn small secondary"
                style={{ fontSize: 12, padding: '4px 8px' }}
                onClick={() => fillDemo('staff', 'StaffChange123!')}
              >
                Staff (कर्मचारी)
              </button>
            </div>
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-field">
            <label className="form-label">युझरनेम (Username)</label>
            <input
              value={username}
              onChange={(e) => setU(e.target.value)}
              autoComplete="username"
              placeholder="तुमचे युझरनेम प्रविष्ट करा"
              required
              autoFocus
            />
          </div>

          <div className="form-field">
            <label className="form-label">पासवर्ड (Password)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setP(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••••••"
              required
            />
          </div>

          {error && (
            <div className="notice-banner notice-err" style={{ padding: '8px 12px', fontSize: 13 }}>
              <IconAlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            style={{ width: '100%', padding: '12px', fontSize: 15, marginTop: 8 }}
          >
            {busy ? 'पडताळणी करत आहे…' : 'लॉगिन करा (Sign In)'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>
          <span>🔒 सुरक्षित डेटा व Progressive Web App (PWA) सह सुसज्ज</span>
        </div>
      </div>
    </div>
  );
}
