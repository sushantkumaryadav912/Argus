import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import type { EntityLabel } from '../types';
import { Tags, User, FileText, AlertOctagon, Server, Terminal } from 'lucide-react';

interface ExtractedEntityItem {
  value: string;
  type: EntityLabel;
  count: number;
  lastSeen: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

const mockEntities: ExtractedEntityItem[] = [
  { value: '198.51.100.42', type: 'IP_ADDRESS', count: 48, lastSeen: '2 mins ago', threatLevel: 'Critical' },
  { value: '203.0.113.195', type: 'IP_ADDRESS', count: 14, lastSeen: '12 mins ago', threatLevel: 'High' },
  { value: 'root', type: 'USER', count: 96, lastSeen: '2 mins ago', threatLevel: 'Critical' },
  { value: 'analyst_dev', type: 'USER', count: 5, lastSeen: '15 mins ago', threatLevel: 'Medium' },
  { value: 'powershell.exe', type: 'FILE_PATH', count: 8, lastSeen: '20 mins ago', threatLevel: 'Critical' },
  { value: 'CVE-2023-48795', type: 'CVE', count: 12, lastSeen: '1 hour ago', threatLevel: 'High' },
  { value: 'production-db-backups', type: 'FILE_PATH', count: 3, lastSeen: '35 mins ago', threatLevel: 'Low' },
  { value: '10.0.4.15', type: 'HOSTNAME', count: 142, lastSeen: 'Just now', threatLevel: 'Low' },
];

export const Entities: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredEntities = selectedType === 'ALL'
    ? mockEntities
    : mockEntities.filter((e) => e.type === selectedType);

  const getEntityIcon = (type: EntityLabel) => {
    switch (type) {
      case 'IP_ADDRESS': return Server;
      case 'USER': return User;
      case 'FILE_PATH': return FileText;
      case 'CVE': return AlertOctagon;
      case 'HOSTNAME': return Terminal;
      default: return Tags;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>spaCy Named-Entity Recognition (NER)</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Extracted security entities across ingested system logs: IP Addresses, User Accounts, File Paths, CVE Identifiers.
        </p>
      </div>

      {/* Entity Summary Category Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.85rem', width: '100%' }}>
        {[
          { label: 'All Entities', type: 'ALL', count: mockEntities.length, color: 'var(--primary)' },
          { label: 'IP Addresses', type: 'IP_ADDRESS', count: 2, color: 'var(--entity-ip-border)' },
          { label: 'User Accounts', type: 'USER', count: 2, color: 'var(--entity-user-border)' },
          { label: 'Files / Executables', type: 'FILE_PATH', count: 2, color: 'var(--entity-path-border)' },
          { label: 'CVE Vulnerabilities', type: 'CVE', count: 1, color: 'var(--entity-cve-border)' },
        ].map((cat) => (
          <GlassCard
            key={cat.type}
            onClick={() => setSelectedType(cat.type)}
            style={{
              cursor: 'pointer',
              borderColor: selectedType === cat.type ? cat.color : 'var(--border-color)',
              backgroundColor: selectedType === cat.type ? `${cat.color}15` : 'var(--bg-card)',
              padding: '1rem',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={cat.label}
            >
              {cat.label}
            </span>
            <h3
              style={{
                fontSize: '1.25rem',
                margin: '0.25rem 0 0 0',
                color: cat.color,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {cat.count} Distinct
            </h3>
          </GlassCard>
        ))}
      </div>

      {/* Entity List Table */}
      <GlassCard style={{ width: '100%', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', margin: 0 }}>Extracted Entities Inventory</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Showing {filteredEntities.length} items</span>
        </div>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left', minWidth: '550px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Entity Value</th>
                <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                <th style={{ padding: '0.75rem 1rem' }}>Frequency</th>
                <th style={{ padding: '0.75rem 1rem' }}>Last Detected</th>
                <th style={{ padding: '0.75rem 1rem' }}>Associated Risk</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntities.map((ent, i) => {
                const Icon = getEntityIcon(ent.type);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-highlight)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Icon size={14} style={{ color: 'var(--primary)' }} />
                        {ent.value}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          backgroundColor: 'var(--bg-dark)',
                          border: '1px solid var(--border-color)',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {ent.type}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                      {ent.count} occurrences
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                      {ent.lastSeen}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          color:
                            ent.threatLevel === 'Critical'
                              ? 'var(--severity-critical)'
                              : ent.threatLevel === 'High'
                              ? 'var(--severity-error)'
                              : ent.threatLevel === 'Medium'
                              ? 'var(--severity-warning)'
                              : 'var(--severity-safe)',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                        }}
                      >
                        ● {ent.threatLevel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
