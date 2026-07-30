import React, { useRef, useState } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import { GlassCard } from '../components/GlassCard';
import { ClassificationBadge } from '../components/ClassificationBadge';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { EntityHighlighter } from '../components/EntityHighlighter';
import { FileUpload } from '../components/FileUpload';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ShieldCheck, Play, Sparkles, FileSearch, ArrowRight } from 'lucide-react';

const sampleLogsList = [
  "2026-07-31 00:45:12 - Failed password for root from 198.51.100.42 port 49152 ssh2 (CVE-2023-48795)",
  "AttachUserPolicy API call executed with AdministratorAccess policy on user analyst_dev by admin-temp from 203.0.113.195",
  "Process creation: powershell.exe -nop -w hidden -encodedcommand JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAA...",
  "2026-07-31 00:35:00 - GetObject call on bucket production-db-backups key 2026-07-30.dump by user backup-agent from 192.0.2.78",
];

export const LogAnalyzer: React.FC = () => {
  const [logInput, setLogInput] = useState(sampleLogsList[0]);
  const { analyze, result, loading, clear } = useAnalysis();
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (logInput.trim()) {
      analyze(logInput);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  const handleSampleClick = (sample: string) => {
    setLogInput(sample);
    analyze(sample);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>NLP Log Entry Analyzer</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Submit raw logs to run classification (BERT), NER (spaCy), summarization (BART), and remediation recommendation.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Input Form & Samples */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
          <GlassCard>
            <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileSearch size={18} style={{ color: 'var(--primary)' }} /> Input Raw Log Text
                </label>
                <button
                  type="button"
                  onClick={clear}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Clear Form
                </button>
              </div>

              <textarea
                rows={5}
                value={logInput}
                onChange={(e) => setLogInput(e.target.value)}
                placeholder="Paste raw log entry here..."
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  resize: 'vertical',
                }}
              />

              <button type="submit" className="btn-primary" disabled={loading || !logInput.trim()}>
                <Play size={16} /> {loading ? 'Running NLP Pipeline...' : 'Run NLP Analysis'}
              </button>
            </form>
          </GlassCard>

          {/* File Upload Zone */}
          <GlassCard>
            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>Or Batch Upload File</h4>
            <FileUpload
              onFileLoaded={(content) => {
                const slice = content.slice(0, 1000);
                setLogInput(slice);
                analyze(slice);
              }}
            />
          </GlassCard>

          {/* Sample Presets */}
          <GlassCard>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Try Pre-loaded Log Samples</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {sampleLogsList.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => handleSampleClick(sample)}
                  style={{
                    textAlign: 'left',
                    backgroundColor: 'var(--bg-dark)',
                    border: '1px solid var(--border-color)',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '6px',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }}
                >
                  Sample #{i + 1}: {sample}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Analysis Output Display (Sticky & Self-contained Scroll) */}
        <div
          ref={resultsRef}
          style={{
            position: 'sticky',
            top: '80px',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            minWidth: 0,
            paddingRight: '0.2rem',
          }}
        >
          {loading ? (
            <GlassCard style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
              <LoadingSpinner label="Tokenizing log, extracting NER entities & classifying threat vector..." size={32} />
            </GlassCard>
          ) : result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Classification Header Card */}
              <GlassCard style={{ borderColor: 'var(--primary)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <ClassificationBadge category={result.category} />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Sparkles size={13} style={{ color: 'var(--primary)' }} /> Fine-tuned BERT
                  </span>
                </div>
                <ConfidenceMeter confidence={result.confidence} />
              </GlassCard>

              {/* Named Entity Extraction (NER) Card */}
              <GlassCard style={{ padding: '1rem' }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Extracted Entities (spaCy NER)
                </h4>
                <EntityHighlighter text={logInput} entities={result.entities} />
              </GlassCard>

              {/* BART Abstractive Incident Summary */}
              <GlassCard style={{ padding: '1rem' }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                  Abstractive Incident Summary (BART-Large)
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, backgroundColor: 'var(--bg-input)', padding: '0.65rem', borderRadius: '6px', margin: 0 }}>
                  {result.summary}
                </p>
              </GlassCard>

              {/* Remediation Recommendation */}
              <GlassCard style={{ backgroundColor: 'rgba(6, 182, 212, 0.05)', borderColor: 'var(--primary-glow)', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem', color: 'var(--primary)' }}>
                  <ShieldCheck size={16} />
                  <h4 style={{ fontSize: '0.85rem', margin: 0 }}>Recommended Action</h4>
                </div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.82rem', lineHeight: 1.45, margin: 0 }}>
                  {result.recommendation}
                </p>
              </GlassCard>

              {/* Related Similar Incidents */}
              <GlassCard style={{ padding: '1rem' }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Top Similar Incidents (Sentence-Transformers)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {result.relatedLogs.map((rel) => (
                    <div
                      key={rel.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'var(--bg-dark)',
                        padding: '0.5rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                        [{rel.id}] {rel.message}
                      </span>
                      <span style={{ color: 'var(--severity-safe)', fontWeight: 600 }}>
                        {Math.round(rel.similarityScore * 100)}% Match
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          ) : (
            <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
              <ArrowRight size={28} style={{ marginBottom: '0.6rem', color: 'var(--primary)' }} />
              <p style={{ fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>Enter log text and click <strong>Run NLP Analysis</strong> to view results.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
