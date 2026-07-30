import React from 'react';
import { GlassCard } from './GlassCard';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  accentColor = 'var(--primary)',
}) => {
  return (
    <GlassCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>{title}</p>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.3rem 0', color: 'var(--text-primary)' }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h2>
          {subtitle && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{subtitle}</p>
          )}
          {trend && (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: trend.isPositive ? 'var(--severity-safe)' : 'var(--severity-error)',
                display: 'inline-block',
                marginTop: '0.2rem',
              }}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value} vs past 24h
            </span>
          )}
        </div>
        <div
          style={{
            backgroundColor: `${accentColor}18`,
            color: accentColor,
            padding: '0.65rem',
            borderRadius: '8px',
            border: `1px solid ${accentColor}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={24} />
        </div>
      </div>
    </GlassCard>
  );
};
