import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSearch,
  ScrollText,
  Tags,
  Search,
  Bell,
  Settings,
  Activity,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onClose }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Log Analyzer', path: '/analyze', icon: FileSearch },
    { label: 'Log Explorer', path: '/logs', icon: ScrollText },
    { label: 'Entities (NER)', path: '/entities', icon: Tags },
    { label: 'Semantic Search', path: '/search', icon: Search },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Platform Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      {isMobile && mobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(3px)',
            zIndex: 45,
          }}
        />
      )}

      <aside
        style={{
          width: '240px',
          backgroundColor: 'var(--bg-dark)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          zIndex: 50,
          transform: isMobile && !mobileOpen ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                backgroundColor: 'var(--primary-glow)',
                padding: '0.35rem',
                borderRadius: '8px',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/file.svg"
                alt="Argus Logo"
                style={{ width: '26px', height: '26px', objectFit: 'contain' }}
              />
            </div>
            <div>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, letterSpacing: '0.05em' }}>ARGUS</h1>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span className="pulse-dot" /> NLP SOC Platform
              </span>
            </div>
          </div>

          {/* Close X button on mobile */}
          {isMobile && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.2rem',
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => isMobile && onClose && onClose()}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 1rem',
                  borderRadius: '8px',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--primary-glow)' : 'transparent',
                  border: isActive ? '1px solid var(--primary)44' : '1px solid transparent',
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  transition: 'all 0.15s ease',
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* System Status Footer */}
        <div
          style={{
            padding: '1rem',
            margin: '0.75rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontSize: '0.78rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Activity size={14} style={{ color: 'var(--severity-safe)' }} /> Pipeline Status
            </span>
            <span style={{ color: 'var(--severity-safe)', fontWeight: 600 }}>Active</span>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>BERT & BART Online</div>
        </div>
      </aside>
    </>
  );
};
