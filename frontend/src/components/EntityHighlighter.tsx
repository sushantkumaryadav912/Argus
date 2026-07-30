import React from 'react';
import type { Entity, EntityLabel } from '../types';

interface EntityHighlighterProps {
  text: string;
  entities: Entity[];
}

const entityStyles: Record<EntityLabel, { bg: string; color: string; border: string }> = {
  IP_ADDRESS: { bg: 'var(--entity-ip)', color: '#38bdf8', border: 'var(--entity-ip-border)' },
  USER: { bg: 'var(--entity-user)', color: '#c084fc', border: 'var(--entity-user-border)' },
  FILE_PATH: { bg: 'var(--entity-path)', color: '#fbbf24', border: 'var(--entity-path-border)' },
  CVE: { bg: 'var(--entity-cve)', color: '#f87171', border: 'var(--entity-cve-border)' },
  HOSTNAME: { bg: 'var(--entity-host)', color: '#34d399', border: 'var(--entity-host-border)' },
  PORT: { bg: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '#6366f1' },
};

export const EntityHighlighter: React.FC<EntityHighlighterProps> = ({ text, entities }) => {
  if (!entities || entities.length === 0) {
    return <span className="font-mono">{text}</span>;
  }

  // Sort entities by start index
  const sortedEntities = [...entities].sort((a, b) => a.start - b.start);
  const segments: React.ReactNode[] = [];
  let lastIndex = 0;

  sortedEntities.forEach((entity, idx) => {
    // Non-entity text slice
    if (entity.start > lastIndex) {
      segments.push(text.slice(lastIndex, entity.start));
    }

    const style = entityStyles[entity.label] || entityStyles.IP_ADDRESS;

    // Highlighted Entity tag
    segments.push(
      <mark
        key={`${entity.label}-${idx}`}
        style={{
          backgroundColor: style.bg,
          color: style.color,
          borderBottom: `2px solid ${style.border}`,
          padding: '0.1rem 0.3rem',
          borderRadius: '3px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.2rem',
          margin: '0 2px',
        }}
        title={`Entity: ${entity.label}`}
      >
        <span>{text.slice(entity.start, entity.end) || entity.text}</span>
        <span
          style={{
            fontSize: '0.65rem',
            opacity: 0.8,
            backgroundColor: `${style.border}44`,
            padding: '0 0.2rem',
            borderRadius: '2px',
          }}
        >
          {entity.label}
        </span>
      </mark>
    );

    lastIndex = entity.end;
  });

  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex));
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-darker)',
        padding: '0.8rem',
        borderRadius: '6px',
        border: '1px solid var(--border-color)',
        lineHeight: 1.8,
      }}
      className="font-mono"
    >
      {segments}
    </div>
  );
};
