import React from 'react';
import { ShieldAlert, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';

interface ClassificationBadgeProps {
  category: string;
}

export const ClassificationBadge: React.FC<ClassificationBadgeProps> = ({ category }) => {
  const getBadgeConfig = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'bruteforce attack':
      case 'bruteforce':
        return { icon: ShieldAlert, bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' };
      case 'malware activity':
      case 'malware':
        return { icon: Zap, bg: 'rgba(220, 38, 38, 0.25)', color: '#dc2626' };
      case 'reconnaissance scan':
      case 'reconnaissance':
        return { icon: AlertTriangle, bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
      case 'privilege escalation':
        return { icon: ShieldAlert, bg: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' };
      default:
        return { icon: ShieldCheck, bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981' };
    }
  };

  const config = getBadgeConfig(category);
  const Icon = config.icon;

  return (
    <span
      style={{
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.color}55`,
        padding: '0.3rem 0.7rem',
        borderRadius: '6px',
        fontSize: '0.85rem',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}
    >
      <Icon size={16} />
      {category}
    </span>
  );
};
