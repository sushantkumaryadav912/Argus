import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { SeverityBadge } from '../components/SeverityBadge';
import { Bell, ShieldAlert, CheckCircle2, AlertTriangle, Info, Trash2 } from 'lucide-react';
import type { Severity } from '../types';
import { getNotifications, markAllNotificationsRead, deleteNotification as deleteNotificationApi } from '../services/api';
import type { NotificationItem } from '../services/api';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    getNotifications(filter === 'unread').then((data) => {
      if (!ignore) {
        setNotifications(data);
        setLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, [filter]);

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsRead();
  };

  const handleDeleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await deleteNotificationApi(id);
  };

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (sev: Severity) => {
    switch (sev) {
      case 'critical':
      case 'error': return ShieldAlert;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        boxSizing: 'border-box',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={22} style={{ color: 'var(--primary)' }} /> Security Alert Notifications
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Real-time security incident alerts, system notifications, and automated threat warnings from MongoDB document store.
          </p>
        </div>

        {unreadCount > 0 && (
          <button className="btn-secondary" onClick={handleMarkAllAsRead}>
            <CheckCircle2 size={16} /> Mark all as read
          </button>
        )}
      </div>

      {/* Filter Header */}
      <GlassCard style={{ width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                backgroundColor: filter === 'all' ? 'var(--primary-glow)' : 'var(--bg-input)',
                color: filter === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
                border: `1px solid ${filter === 'all' ? 'var(--primary)' : 'var(--border-color)'}`,
                padding: '0.35rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              All Notifications ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              style={{
                backgroundColor: filter === 'unread' ? 'var(--primary-glow)' : 'var(--bg-input)',
                color: filter === 'unread' ? 'var(--primary)' : 'var(--text-secondary)',
                border: `1px solid ${filter === 'unread' ? 'var(--primary)' : 'var(--border-color)'}`,
                padding: '0.35rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Showing {filtered.length} alert records
          </span>
        </div>
      </GlassCard>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
        {loading ? (
          <GlassCard style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            <p>Loading security notifications from MongoDB...</p>
          </GlassCard>
        ) : filtered.length > 0 ? (
          filtered.map((item) => {
            const Icon = getIcon(item.severity);
            return (
              <GlassCard
                key={item.id}
                style={{
                  borderColor: item.read ? 'var(--border-color)' : 'var(--primary-glow)',
                  backgroundColor: item.read ? 'var(--bg-card)' : 'rgba(6, 182, 212, 0.04)',
                  position: 'relative',
                  width: '100%',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', width: '100%' }}>
                  <div
                    style={{
                      padding: '0.6rem',
                      borderRadius: '8px',
                      flexShrink: 0,
                      backgroundColor:
                        item.severity === 'critical' || item.severity === 'error'
                          ? 'rgba(239, 68, 68, 0.15)'
                          : item.severity === 'warning'
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(6, 182, 212, 0.15)',
                      color:
                        item.severity === 'critical' || item.severity === 'error'
                          ? 'var(--severity-critical)'
                          : item.severity === 'warning'
                          ? 'var(--severity-warning)'
                          : 'var(--primary)',
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <h4 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', wordBreak: 'break-word' }}>
                        {item.title}
                        {!item.read && (
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--primary)',
                              display: 'inline-block',
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{item.timestamp}</span>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0.6rem 0', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      {item.message}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <SeverityBadge severity={item.severity} />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          [{item.category}]
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteNotification(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '0.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          flexShrink: 0,
                        }}
                        title="Dismiss notification"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })
        ) : (
          <GlassCard style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p>No notifications matching your filter criteria.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
