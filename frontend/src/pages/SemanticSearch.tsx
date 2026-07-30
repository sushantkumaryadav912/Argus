import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Search, Sparkles, Database, X } from 'lucide-react';
import { searchSemanticLogs } from '../services/api';
import type { SemanticSearchResult } from '../types';
import { SeverityBadge } from '../components/SeverityBadge';

export const SemanticSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || 'SSH brute force attempts targeting root');
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    let ignore = false;
    const qParam = searchParams.get('q');
    const termToSearch = qParam || 'SSH brute force attempts targeting root';

    searchSemanticLogs(termToSearch).then((data) => {
      if (!ignore) {
        setQuery(termToSearch);
        setResults(data);
        setHasSearched(true);
      }
    });

    return () => {
      ignore = true;
    };
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const handlePresetClick = (preset: string) => {
    setQuery(preset);
    setSearchParams({ q: preset });
  };

  const clearQuery = () => {
    setQuery('');
    setSearchParams({});
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Sentence-Transformers Semantic Search</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Query security logs by natural language concept using dense vector embeddings (all-MiniLM-L6-v2 / FAISS).
        </p>
      </div>

      {/* Search Input Hero Section */}
      <GlassCard style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', width: '100%' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} /> Natural Language Query
          </label>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%' }}>
            <div style={{ flex: 1, position: 'relative', minWidth: '240px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Find all unauthorized admin policy escalations..."
                style={{ width: '100%', paddingLeft: '2.8rem', paddingRight: '2.5rem', fontSize: '0.95rem' }}
              />
              {query && (
                <button
                  type="button"
                  onClick={clearQuery}
                  style={{
                    position: 'absolute',
                    right: '0.8rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="btn-primary" disabled={!query.trim()}>
              <Search size={16} /> Search Vectors
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Prompts:</span>
            {[
              'SSH brute force attempts',
              'Obfuscated PowerShell executions',
              'S3 bucket access anomalies',
              'Port scanning activity',
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetClick(preset)}
                style={{
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                {preset}
              </button>
            ))}
          </div>
        </form>
      </GlassCard>

      {/* Search Results Display */}
      {hasSearched ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Found <strong>{results.length}</strong> semantically relevant log matches for "<em>{query}</em>"
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Database size={14} /> FAISS Index — Cosine Similarity
            </span>
          </div>

          {results.length > 0 ? (
            results.map((res, i) => {
              const scorePct = Math.round(res.similarityScore * 100);
              return (
                <GlassCard key={i} style={{ width: '100%', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span className="font-mono" style={{ color: 'var(--text-highlight)', fontWeight: 600, fontSize: '0.85rem' }}>
                        {res.log.id}
                      </span>
                      <SeverityBadge severity={res.log.severity} />
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{res.log.source}</span>
                    </div>

                    {/* Similarity Progress Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '150px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--severity-safe)' }}>
                        {scorePct}% Match
                      </span>
                      <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${scorePct}%`, height: '100%', backgroundColor: 'var(--severity-safe)' }} />
                      </div>
                    </div>
                  </div>

                  <pre
                    style={{
                      backgroundColor: 'var(--bg-darker)',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      marginBottom: '0.6rem',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {res.log.message}
                  </pre>

                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Matched Tokens:</span>
                    {res.matchedKeywords.map((kw, k) => (
                      <span
                        key={k}
                        style={{
                          backgroundColor: 'var(--primary-glow)',
                          color: 'var(--primary)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              );
            })
          ) : (
            <GlassCard style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <p>No log records matched your query "{query}". Try a different security search term.</p>
            </GlassCard>
          )}
        </div>
      ) : null}
    </div>
  );
};
