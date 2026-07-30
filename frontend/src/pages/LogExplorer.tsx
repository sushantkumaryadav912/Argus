import React, { useCallback, useEffect, useState } from 'react';
import type { LogEntry, Severity } from '../types';
import { getLogs } from '../services/api';
import { GlassCard } from '../components/GlassCard';
import { LogTable } from '../components/LogTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SeverityBadge } from '../components/SeverityBadge';
import { ClassificationBadge } from '../components/ClassificationBadge';
import { Search, Filter, RefreshCw, X, FileText, Calendar, Server, User, Terminal } from 'lucide-react';

export const LogExplorer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const fetchLogsData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLogs({
        severity: severityFilter === 'all' ? undefined : severityFilter,
        search: searchQuery || undefined,
      });
      setLogs(data);
    } finally {
      setLoading(false);
    }
  }, [severityFilter, searchQuery]);

  useEffect(() => {
    let ignore = false;
    getLogs({
      severity: severityFilter === 'all' ? undefined : severityFilter,
      search: searchQuery || undefined,
    }).then((data) => {
      if (!ignore) {
        setLogs(data);
        setLoading(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, [severityFilter, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogsData();
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedLog(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Ingested Security Log Explorer</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Filter, search, and inspect normalized system logs from Syslog, HDFS, BGL, and AWS CloudTrail.
          </p>
        </div>
        <button className="btn-secondary" onClick={fetchLogsData}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', position: 'relative', minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search message, user, IP address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.4rem' }}
            />
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Main Content Table */}
      <div style={{ width: '100%' }}>
        <GlassCard>
          {loading ? (
            <LoadingSpinner label="Fetching normalized logs..." />
          ) : logs.length > 0 ? (
            <LogTable logs={logs} onSelectLog={(log) => setSelectedLog(log)} />
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No log entries matched your filter parameters.
            </p>
          )}
        </GlassCard>
      </div>

      {/* Log Detail Modal Overlay */}
      {selectedLog && (
        <div
          onClick={() => setSelectedLog(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--primary-glow)',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 20px rgba(6, 182, 212, 0.15)',
              position: 'relative',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <span className="font-mono" style={{ color: 'var(--text-highlight)', fontSize: '0.8rem', fontWeight: 600 }}>
                  {selectedLog.id}
                </span>
                <h3 style={{ fontSize: '1.2rem', margin: '0.2rem 0 0.4rem 0', color: 'var(--text-primary)' }}>
                  Log Inspection Detail
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <SeverityBadge severity={selectedLog.severity as Severity} />
                  {selectedLog.category && <ClassificationBadge category={selectedLog.category} />}
                </div>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                style={{
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  borderRadius: '6px',
                  padding: '0.4rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Grid Metadata Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ backgroundColor: 'var(--bg-dark)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                  <Calendar size={13} /> Timestamp (UTC)
                </span>
                <p style={{ color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
                  {new Date(selectedLog.timestamp).toUTCString()}
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--bg-dark)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                  <Server size={13} /> Source & Service
                </span>
                <p style={{ color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
                  {selectedLog.source} ({selectedLog.service})
                </p>
              </div>

              {selectedLog.user && (
                <div style={{ backgroundColor: 'var(--bg-dark)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                    <User size={13} /> User Account
                  </span>
                  <p className="font-mono" style={{ color: 'var(--entity-user-border)', margin: 0, fontWeight: 600 }}>
                    {selectedLog.user}
                  </p>
                </div>
              )}

              {selectedLog.srcIp && (
                <div style={{ backgroundColor: 'var(--bg-dark)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                    <Terminal size={13} /> Source IP Address
                  </span>
                  <p className="font-mono" style={{ color: 'var(--primary)', margin: 0, fontWeight: 600 }}>
                    {selectedLog.srcIp}
                  </p>
                </div>
              )}
            </div>

            {/* Raw Log Payload */}
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
                <FileText size={14} /> Full Log Raw Message
              </span>
              <pre
                style={{
                  backgroundColor: 'var(--bg-darker)',
                  padding: '1rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  border: '1px solid var(--border-color)',
                  maxHeight: '220px',
                  overflowY: 'auto',
                }}
              >
                {selectedLog.message}
              </pre>
            </div>

            {/* Footer Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <button
                className="btn-secondary"
                onClick={() => setSelectedLog(null)}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
