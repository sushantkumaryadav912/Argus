import React from 'react';
import type { LogEntry } from '../types';
import { SeverityBadge } from './SeverityBadge';
import { ClassificationBadge } from './ClassificationBadge';

interface LogTableProps {
  logs: LogEntry[];
  onSelectLog?: (log: LogEntry) => void;
}

export const LogTable: React.FC<LogTableProps> = ({ logs, onSelectLog }) => {
  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.85rem',
          textAlign: 'left',
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontSize: '0.72rem',
              letterSpacing: '0.05em',
            }}
          >
            <th style={{ padding: '0.75rem 1rem' }}>ID</th>
            <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
            <th style={{ padding: '0.75rem 1rem' }}>Severity</th>
            <th style={{ padding: '0.75rem 1rem' }}>Source / Service</th>
            <th style={{ padding: '0.75rem 1rem' }}>Category</th>
            <th style={{ padding: '0.75rem 1rem' }}>Log Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              onClick={() => onSelectLog && onSelectLog(log)}
              style={{
                borderBottom: '1px solid var(--border-color)',
                cursor: onSelectLog ? 'pointer' : 'default',
                transition: 'background-color var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--bg-card-hover)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
              }}
            >
              <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text-highlight)' }}>
                {log.id}
              </td>
              <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td style={{ padding: '0.75rem 1rem' }}>
                <SeverityBadge severity={log.severity} />
              </td>
              <td style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>
                <div>{log.source}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {log.service}
                </div>
              </td>
              <td style={{ padding: '0.75rem 1rem' }}>
                {log.category ? (
                  <ClassificationBadge category={log.category} />
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Unclassified</span>
                )}
              </td>
              <td
                style={{
                  padding: '0.75rem 1rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  maxWidth: '360px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={log.message}
              >
                {log.message}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
