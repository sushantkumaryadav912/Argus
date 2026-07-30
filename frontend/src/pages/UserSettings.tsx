import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { User, ShieldCheck, Key, Bell, CheckCircle2, Save, Mail, Lock } from 'lucide-react';

export const UserSettings: React.FC = () => {
  const [name, setName] = useState('Sushant Kumar Yadav');
  const [email, setEmail] = useState('sushant@example.com');
  const [role] = useState('Lead Security Analyst (Admin)');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalSms, setCriticalSms] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
      <div>
        <h1 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <User size={22} style={{ color: 'var(--primary)' }} /> User Profile & Security Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Manage your analyst profile, security credentials, multi-factor authentication, and alert preferences.
        </p>
      </div>

      <GlassCard style={{ width: '100%', overflow: 'hidden' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          {/* User Profile Info */}
          <div style={{ width: '100%' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={18} style={{ color: 'var(--primary)' }} /> Analyst Profile Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Work Email</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.8rem', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assigned Access Role</label>
                <input
                  type="text"
                  value={role}
                  disabled
                  style={{ width: '100%', opacity: 0.7, cursor: 'not-allowed', backgroundColor: 'var(--bg-dark)' }}
                />
              </div>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

          {/* Account Security & Authentication */}
          <div style={{ width: '100%' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--severity-safe)' }} /> Account Security & Credentials
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', backgroundColor: 'var(--bg-dark)', padding: '0.8rem 1rem', borderRadius: '6px', border: '1px solid var(--border-color)', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h4 style={{ fontSize: '0.88rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Lock size={15} style={{ color: 'var(--primary)' }} /> Two-Factor Authentication (2FA / MFA)
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', wordBreak: 'break-word' }}>
                    Enforce hardware YubiKey / TOTP authenticator app verification upon login.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={(e) => setTwoFactor(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', flexShrink: 0 }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', backgroundColor: 'var(--bg-dark)', padding: '0.8rem 1rem', borderRadius: '6px', border: '1px solid var(--border-color)', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h4 style={{ fontSize: '0.88rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Key size={15} style={{ color: 'var(--severity-warning)' }} /> Analyst API Key
                  </h4>
                  <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-highlight)', margin: '0.2rem 0 0 0', wordBreak: 'break-all' }}>
                    argus_live_sec_key_9941a87b2...
                  </p>
                </div>
                <button type="button" className="btn-secondary" style={{ fontSize: '0.78rem', padding: '0.35rem 0.7rem', flexShrink: 0 }}>
                  Regenerate Key
                </button>
              </div>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

          {/* Alert Notification Preferences */}
          <div style={{ width: '100%' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Bell size={18} style={{ color: 'var(--severity-warning)' }} /> Personal Alert Subscriptions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', width: '100%' }}>
                <input
                  type="checkbox"
                  id="emailAlerts"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  style={{ width: '16px', height: '16px', marginTop: '0.15rem', cursor: 'pointer', flexShrink: 0 }}
                />
                <label htmlFor="emailAlerts" style={{ fontSize: '0.85rem', cursor: 'pointer', flex: 1, wordBreak: 'break-word' }}>
                  Send email digest for Critical & Error severity log incidents
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', width: '100%' }}>
                <input
                  type="checkbox"
                  id="criticalSms"
                  checked={criticalSms}
                  onChange={(e) => setCriticalSms(e.target.checked)}
                  style={{ width: '16px', height: '16px', marginTop: '0.15rem', cursor: 'pointer', flexShrink: 0 }}
                />
                <label htmlFor="criticalSms" style={{ fontSize: '0.85rem', cursor: 'pointer', flex: 1, wordBreak: 'break-word' }}>
                  Send immediate PagerDuty / SMS alert for automated BruteForce & Malware detections
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <button type="submit" className="btn-primary">
              <Save size={16} /> Save Profile Changes
            </button>
            {saved && (
              <span style={{ color: 'var(--severity-safe)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={16} /> Profile updated successfully!
              </span>
            )}
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
