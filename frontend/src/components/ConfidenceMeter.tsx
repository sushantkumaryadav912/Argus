import React from 'react';

interface ConfidenceMeterProps {
  confidence: number; // 0.0 to 1.0
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ confidence }) => {
  const percentage = Math.round(confidence * 100);

  const getColor = (val: number) => {
    if (val >= 90) return 'var(--severity-critical)';
    if (val >= 75) return 'var(--severity-warning)';
    return 'var(--primary)';
  };

  const color = getColor(percentage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Model Confidence</span>
        <span style={{ fontWeight: 700, color }}>{percentage}%</span>
      </div>
      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--bg-input)',
          borderRadius: '4px',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '4px',
            transition: 'width 0.5s ease-in-out',
            boxShadow: `0 0 8px ${color}88`,
          }}
        />
      </div>
    </div>
  );
};
