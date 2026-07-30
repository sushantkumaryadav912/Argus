import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
  onFileLoaded: (content: string, filename: string) => void;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileLoaded, accept = '.log,.txt,.json,.csv' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadedFileName, setLoadedFileName] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setLoadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onFileLoaded(text, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      style={{
        border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border-color)'}`,
        backgroundColor: isDragging ? 'var(--primary-glow)' : 'var(--bg-input)',
        borderRadius: '8px',
        padding: '1.5rem',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
      {loadedFileName ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--severity-safe)' }}>
          <CheckCircle2 size={20} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Loaded: {loadedFileName}</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
          <UploadCloud size={28} style={{ color: 'var(--primary)' }} />
          <p style={{ fontSize: '0.85rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Click to upload</strong> or drag and drop log file
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supports .log, .txt, .json, .csv (Max 10MB)</span>
        </div>
      )}
    </div>
  );
};
