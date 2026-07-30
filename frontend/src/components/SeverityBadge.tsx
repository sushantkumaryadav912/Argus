import React from 'react';
import type { Severity } from '../types';

interface SeverityBadgeProps {
  severity: Severity;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const styles: Record<Severity, { bg: string; text: string; border: string }> = {
    info: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: '#3b82f644' },
    warning: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: '#f59e0b44' },
    error: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: '#ef444444' },
    critical: { bg: 'rgba(220, 38, 38, 0.25)', text: '#fca5a5', border: '#dc2626' },
  };

  const current = styles[severity] || styles.info;

  return (
    <span
      style={{
        backgroundColor: current.bg,
        color: current.text,
        border: `1px solid ${current.border}`,
        padding: '0.2rem 0.55rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: current.text,
        }}
      />
      {severity}
    </span>
  );
};
