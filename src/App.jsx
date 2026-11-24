import React from 'react';
import { Routes, Route, NavLink, Navigate, Link } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import { MOCK } from './api.js';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Customers from './pages/Customers.jsx';
import CustomerForm from './pages/CustomerForm.jsx';
import CustomerDetail from './pages/CustomerDetail.jsx';
import Applications from './pages/Applications.jsx';
import ApplicationForm from './pages/ApplicationForm.jsx';
import Transactions from './pages/Transactions.jsx';
import Services from './pages/Services.jsx';
import Users from './pages/Users.jsx';
import Settings from './pages/Settings.jsx';
import { PwaInstallHeaderButton } from './components/PwaInstallBanner.jsx';
import {
  IconHome,
  IconUsers,
  IconFileText,
  IconWallet,
  IconList,
  IconShield,
  IconSettings,
  IconLogOut
} from './components/Icons.jsx';

export default function App() {
  const { user, loading, logout, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="login-container">
        <div style={{ color: '#fff', fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="avatar-circle" style={{ width: 40, height: 40, background: '#3b82f6' }}>SS</div>
          लोड होत आहे… (Loading portal)
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <header className="top-header">
        <div className="header-inner">
          <Link to="/" className="brand-section">
            <div className="brand-logo-badge">SS</div>
            <div className="brand-info">
              <span className="brand-name">SHREE SAI COMPUTER</span>
              <span className="brand-sub">Sales and Services · Citizen Services Portal</span>
            </div>
          </Link>

          <nav className="desktop-menu">
            <NavLink to="/" end>
              <IconHome size={16} /> मुख्य पान
            </NavLink>
            <NavLink to="/customers">
              <IconUsers size={16} /> ग्राहक
            </NavLink>
            <NavLink to="/applications">
              <IconFileText size={16} /> अर्ज
            </NavLink>
            <NavLink to="/transactions">
              <IconWallet size={16} /> जमा-खर्च
            </NavLink>
            <NavLink to="/services">
              <IconList size={16} /> सेवा यादी
            </NavLink>
            {isAdmin && (
              <NavLink to="/users">
                <IconShield size={16} /> वापरकर्ते
              </NavLink>
            )}
            <NavLink to="/settings">
              <IconSettings size={16} /> सेटिंग्ज
            </NavLink>
          </nav>

          <div className="header-actions">
            <PwaInstallHeaderButton />

            <div className="user-profile-badge" title={`लॉगिन: ${user.username}`}>
              <span style={{ fontWeight: 600 }}>{user.full_name || user.username}</span>
              <span className="user-role-chip">{user.role}</span>
            </div>

            <button
              type="button"
              className="btn-logout"
              onClick={logout}
              title="लॉगआउट करा"
            >
              <IconLogOut size={15} />
              <span>लॉगआउट</span>
            </button>
          </div>
        </div>
      </header>

      {MOCK && (
        <div className="demo-banner">
          <span>⚡ DEMO MODE: डेटा तुमच्या या ब्राउझरमध्ये (स्थानिक डेटाबेस) सुरक्षित साठवला जात आहे.</span>
        </div>
      )}

      <main className="wrap">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/new" element={<CustomerForm />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/customers/:id/edit" element={<CustomerForm />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/new" element={<ApplicationForm />} />
          <Route path="/applications/:id/edit" element={<ApplicationForm />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/services" element={<Services />} />
          <Route path="/users" element={isAdmin ? <Users /> : <Navigate to="/" />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-nav-bar no-print">
        <NavLink to="/" end className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <IconHome size={18} />
          <span>मुख्य</span>
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <IconUsers size={18} />
          <span>ग्राहक</span>
        </NavLink>
        <NavLink to="/applications" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <IconFileText size={18} />
          <span>अर्ज</span>
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <IconWallet size={18} />
          <span>जमा-खर्च</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <IconSettings size={18} />
          <span>अधिक</span>
        </NavLink>
      </nav>
    </>
  );
}
