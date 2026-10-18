import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function AlertBanner({ type = 'info', message, onClose }) {
  if (!message) return null;

  const config = {
    success: { icon: CheckCircle2, className: 'alert-success' },
    danger: { icon: AlertCircle, className: 'alert-danger' },
    info: { icon: Info, className: 'alert-info' },
  }[type] || { icon: Info, className: 'alert-info' };

  const Icon = config.icon;

  return (
    <div className={`alert-banner ${config.className}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <Icon size={18} style={{ flexShrink: 0 }} />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
