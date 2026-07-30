import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = 'There are no records matching your current filter criteria.',
  icon: Icon = Inbox,
  action,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--bg-card)',
        border: '1px border-dashed var(--border-color)',
        borderRadius: '10px',
        color: 'var(--text-muted)',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-dark)',
          padding: '1rem',
          borderRadius: '50%',
          marginBottom: '1rem',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)',
        }}
      >
        <Icon size={32} />
      </div>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.4rem', fontSize: '1.1rem' }}>{title}</h3>
      <p style={{ maxWidth: '400px', fontSize: '0.85rem', marginBottom: action ? '1.5rem' : 0 }}>{description}</p>
      {action}
    </div>
  );
};
