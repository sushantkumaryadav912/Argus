import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Cpu, Database, Server, CheckCircle2, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:8000/api');
  const [useGpu, setUseGpu] = useState(true);
  const [modelType, setModelType] = useState('bert-base-uncased');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.75);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Platform & Pipeline Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Configure FastAPI connection endpoints, NLP model hyperparameters, and GPU inference settings.
        </p>
      </div>

      <GlassCard>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Backend Connection */}
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Server size={18} style={{ color: 'var(--primary)' }} /> FastAPI REST Backend Config
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>API Base URL</label>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

          {/* Model & Inference Settings */}
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={18} style={{ color: 'var(--accent)' }} /> Model & Transformer Configuration
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Log Classification Model</label>
                <select value={modelType} onChange={(e) => setModelType(e.target.value)}>
                  <option value="bert-base-uncased">BERT Base (Fine-tuned)</option>
                  <option value="distilbert-base-uncased">DistilBERT (Fast Inference)</option>
                  <option value="roberta-base">RoBERTa Security Custom</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confidence Threshold ({confidenceThreshold})</label>
                <input
                  type="range"
                  min="0.5"
                  max="0.95"
                  step="0.05"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <input
                type="checkbox"
                id="gpuToggle"
                checked={useGpu}
                onChange={(e) => setUseGpu(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="gpuToggle" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                Enable PyTorch CUDA GPU Acceleration (V100 / T4)
              </label>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

          {/* Database & Vector Store Settings */}
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Database size={18} style={{ color: 'var(--severity-warning)' }} /> Vector Store & Database
            </h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, backgroundColor: 'var(--bg-dark)', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Relational DB</span>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>PostgreSQL 16</p>
              </div>
              <div style={{ flex: 1, backgroundColor: 'var(--bg-dark)', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vector Search Index</span>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>FAISS (IndexFlatIP)</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn-primary">
              <Save size={16} /> Save Configuration
            </button>
            {saved && (
              <span style={{ color: 'var(--severity-safe)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={16} /> Settings saved successfully!
              </span>
            )}
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
