import React, { useState, useEffect } from 'react';
import { IconSmartphone, IconCheck, IconX } from './Icons.jsx';

let deferredPrompt = null;

export function usePwaInstall() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode already
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      setCanInstall(false);
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const triggerInstall = async () => {
    if (!deferredPrompt) {
      // Fallback instruction for browsers without direct prompt (e.g., iOS Safari)
      alert('ॲप इन्स्टॉल करण्यासाठी: तुमच्या ब्राउझर मेनूमध्ये जाऊन "Add to Home Screen" किंवा "Install App" निवडा.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      deferredPrompt = null;
      setCanInstall(false);
    }
  };

  return { canInstall, isInstalled, triggerInstall };
}

export function PwaInstallHeaderButton() {
  const { isInstalled, triggerInstall } = usePwaInstall();

  if (isInstalled) {
    return (
      <span className="pwa-badge installed" title="PWA Standalone App Mode Active">
        <IconCheck size={14} /> ॲप सक्रिय
      </span>
    );
  }

  return (
    <button
      type="button"
      className="pwa-install-btn"
      onClick={triggerInstall}
      title="Shree Sai संगणक / मोबाईल ॲप म्हणून इन्स्टॉल करा"
    >
      <IconSmartphone size={16} />
      <span>ॲप इन्स्टॉल करा</span>
    </button>
  );
}

export function PwaInfoCard() {
  const { canInstall, isInstalled, triggerInstall } = usePwaInstall();

  return (
    <div className="card pwa-info-card">
      <div className="pwa-info-header">
        <div className="pwa-icon-box">
          <IconSmartphone size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0 }}>वेब ॲप (Progressive Web App - PWA)</h3>
          <p className="muted" style={{ margin: '4px 0 0' }}>
            हे सॉफ्टवेअर थेट तुमच्या कॉम्प्युटरवर किंवा मोबाईलवर ॲपप्रमाणे चालते.
          </p>
        </div>
      </div>

      <div className="pwa-features-grid">
        <div className="pwa-feature-item">
          <IconCheck size={16} className="text-emerald" />
          <span>जलद उघडणे (Instant Launch)</span>
        </div>
        <div className="pwa-feature-item">
          <IconCheck size={16} className="text-emerald" />
          <span>डेस्कटॉप आणि मोबाईल होम स्क्रीन आयकॉन</span>
        </div>
        <div className="pwa-feature-item">
          <IconCheck size={16} className="text-emerald" />
          <span>इंटरनेट नसतानाही स्थानिक डेटा सुरक्षित</span>
        </div>
        <div className="pwa-feature-item">
          <IconCheck size={16} className="text-emerald" />
          <span>फुल स्क्रीन कार्यप्रणाली (No browser bars)</span>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {isInstalled ? (
          <div className="msg ok" style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <IconCheck size={18} /> हे ॲप आधीच इन्स्टॉल केलेले आहे (Installed & Running)
          </div>
        ) : (
          <button className="btn pwa-btn-lg" onClick={triggerInstall}>
            <IconSmartphone size={18} />
            <span>Shree Sai App इन्स्टॉल करा (Install Web App)</span>
          </button>
        )}
      </div>
    </div>
  );
}
