export type Severity = 'info' | 'warning' | 'error' | 'critical';

export type EntityLabel = 'IP_ADDRESS' | 'USER' | 'FILE_PATH' | 'CVE' | 'HOSTNAME' | 'PORT';

export interface Entity {
  text: string;
  label: EntityLabel;
  start: number;
  end: number;
}

export interface RelatedLog {
  id: string;
  timestamp: string;
  message: string;
  similarityScore: number;
  category: string;
}

export interface AnalysisResult {
  category: string;
  confidence: number;
  summary: string;
  entities: Entity[];
  relatedLogs: RelatedLog[];
  recommendation: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  service: string;
  user?: string;
  srcIp?: string;
  dstIp?: string;
  action: string;
  message: string;
  severity: Severity;
  category?: string;
}

export interface TimeSeriesPoint {
  time: string;
  info: number;
  warning: number;
  error: number;
  critical: number;
}

export interface DashboardStats {
  totalLogs: number;
  threatsDetected: number;
  criticalAlerts: number;
  avgProcessingTimeMs: number;
  classificationBreakdown: {
    category: string;
    count: number;
    color: string;
  }[];
  timeSeriesData: TimeSeriesPoint[];
}

export interface SemanticSearchResult {
  log: LogEntry;
  similarityScore: number;
  matchedKeywords: string[];
}
