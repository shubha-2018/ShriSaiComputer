import React, { useState, useCallback } from 'react';
import { IconCheck, IconAlertCircle, IconX } from './components/Icons.jsx';

export const STATUSES = [
  'नवीन अर्ज',
  'कागदपत्रे अपूर्ण',
  'अर्ज सबमिट',
  'प्रलंबित',
  'मंजूर',
  'दाखला वितरित'
];

export const METHODS = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Other'];

// Hook for success / error notifications
export function useNotice() {
  const [notice, setNotice] = useState(null);
  const ok = useCallback((text) => {
    setNotice({ kind: 'ok', text });
    setTimeout(() => setNotice(null), 4500);
  }, []);
  const err = useCallback((e) => {
    setNotice({ kind: 'err', text: e.message || String(e) });
  }, []);
  return { notice, ok, err, clear: () => setNotice(null) };
}

// Notice banner with modern toast design
export const Notice = ({ notice, onClose }) => {
  if (!notice) return null;
  const isOk = notice.kind === 'ok';
  return (
    <div className={`notice-banner ${isOk ? 'notice-ok' : 'notice-err'}`}>
      <div className="notice-icon">
        {isOk ? <IconCheck size={18} /> : <IconAlertCircle size={18} />}
      </div>
      <div className="notice-content">{notice.text}</div>
      {onClose && (
        <button type="button" className="notice-close" onClick={onClose}>
          <IconX size={16} />
        </button>
      )}
    </div>
  );
};

// Form Field component with clean layout
export const Field = ({ label, required, help, children, className = '' }) => (
  <div className={`form-field ${className}`}>
    {label && (
      <label className="form-label">
        {label}
        {required && <span className="req-star"> *</span>}
      </label>
    )}
    {children}
    {help && <span className="form-help">{help}</span>}
  </div>
);

// Modern status badge with colored status dot
export const StatusTag = ({ status }) => {
  let type = 'pending';
  if (status === 'मंजूर' || status === 'दाखला वितरित') {
    type = 'done';
  } else if (status === 'कागदपत्रे अपूर्ण') {
    type = 'error';
  } else if (status === 'नवीन अर्ज' || status === 'अर्ज सबमिट') {
    type = 'info';
  }

  return (
    <span className={`status-pill status-${type}`}>
      <span className="status-dot" />
      <span>{status}</span>
    </span>
  );
};

// Avatar with initials
export const Avatar = ({ name = '', size = 36 }) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'SS';

  return (
    <div
      className="avatar-circle"
      style={{ width: size, height: size, fontSize: Math.floor(size * 0.42) }}
      title={name}
    >
      {initials}
    </div>
  );
};

// Modern KPI Stat Card
export const StatCard = ({ title, value, icon: Icon, variant = 'default', subtitle }) => (
  <div className={`stat-card stat-${variant}`}>
    <div className="stat-card-body">
      <div className="stat-info">
        <span className="stat-title">{title}</span>
        <div className="stat-value">{value}</div>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
      {Icon && (
        <div className="stat-icon-wrapper">
          <Icon size={24} />
        </div>
      )}
    </div>
  </div>
);

// Empty State illustration component
export const EmptyState = ({ message = 'नोंदी उपलब्ध नाहीत', action, icon: Icon }) => (
  <div className="empty-state">
    <div className="empty-icon-wrap">
      {Icon ? <Icon size={32} /> : <IconAlertCircle size={32} />}
    </div>
    <p className="empty-text">{message}</p>
    {action && <div className="empty-action">{action}</div>}
  </div>
);

// Delete confirmation dialog
export const confirmDelete = (what) =>
  window.confirm(`${what}\n\nतुम्हाला ही नोंद नक्की काढून टाकायची आहे का?\n(Are you sure you want to delete this?)`);
