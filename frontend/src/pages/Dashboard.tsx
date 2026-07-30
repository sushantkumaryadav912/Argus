import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { StatCard } from '../components/StatCard';
import { GlassCard } from '../components/GlassCard';
import { LogTable } from '../components/LogTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { mockRecentLogs } from '../services/mockData';
import {
  ShieldAlert,
  Activity,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { stats, loading } = useDashboard();

  if (loading || !stats) {
    return <LoadingSpinner label="Loading Argus SOC Metrics..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Security Operations Overview</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Real-time NLP log classification and automated threat telemetry overview.
        </p>
      </div>

      {/* Top 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard
          title="Total Logs Ingested"
          value={stats.totalLogs}
          icon={Activity}
          subtitle="Processed via NLP pipeline"
          trend={{ value: '12%', isPositive: true }}
          accentColor="var(--primary)"
        />
        <StatCard
          title="Threats Classified"
          value={stats.threatsDetected}
          icon={ShieldAlert}
          subtitle="BruteForce, Malware, Recon"
          trend={{ value: '4.8%', isPositive: false }}
          accentColor="var(--severity-warning)"
        />
        <StatCard
          title="Critical Incidents"
          value={stats.criticalAlerts}
          icon={AlertTriangle}
          subtitle="Requires analyst review"
          accentColor="var(--severity-critical)"
        />
        <StatCard
          title="Avg Inference Time"
          value={`${stats.avgProcessingTimeMs} ms`}
          icon={Clock}
          subtitle="BERT / spaCy pipeline latency"
          accentColor="var(--severity-safe)"
        />
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', width: '100%' }}>
        {/* Log Volume & Severity Timeline */}
        <GlassCard>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Log Event Volume & Severity Timeline</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeSeriesData}>
                <defs>
                  <linearGradient id="colorInfo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-dark)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '6px',
                  }}
                />
                <Area type="monotone" dataKey="info" stroke="#06b6d4" fillOpacity={1} fill="url(#colorInfo)" name="Info Logs" />
                <Area type="monotone" dataKey="critical" stroke="#ef4444" fillOpacity={1} fill="url(#colorCritical)" name="Critical Threats" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Threat Classification Breakdown */}
        <GlassCard>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Classification Distribution</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.classificationBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="category"
                >
                  {stats.classificationBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-dark)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '6px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Recent High Priority Alerts Table */}
      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', margin: 0 }}>Recent High-Priority Threats</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Extracted via regex & classified by fine-tuned BERT model</p>
          </div>
        </div>
        <LogTable logs={mockRecentLogs} />
      </GlassCard>
    </div>
  );
};
