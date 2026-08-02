import axios from 'axios';
import type { AnalysisResult, DashboardStats, LogEntry, SemanticSearchResult } from '../types';
import { mockDashboardStats, mockRecentLogs, mockSampleAnalysis, mockSemanticSearchResults } from './mockData';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  read: boolean;
  category: string;
}

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const res = await api.get<DashboardStats>('/dashboard/stats');
    return res.data;
  } catch (err) {
    console.warn('[Argus API] Backend unreachable or endpoint missing. Using fallback mock data.', err);
    return mockDashboardStats;
  }
};

export const getLogs = async (params?: { severity?: string; search?: string; limit?: number }): Promise<LogEntry[]> => {
  try {
    const res = await api.get<LogEntry[]>('/logs', { params });
    return res.data;
  } catch (err) {
    console.warn('[Argus API] Backend unreachable. Using fallback mock logs.', err);
    let logs = [...mockRecentLogs];
    if (params?.severity) {
      logs = logs.filter((l) => l.severity === params.severity);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.message.toLowerCase().includes(q) ||
          l.source.toLowerCase().includes(q) ||
          (l.user && l.user.toLowerCase().includes(q)) ||
          (l.srcIp && l.srcIp.toLowerCase().includes(q))
      );
    }
    return logs;
  }
};

export const analyzeLogEntry = async (logText: string): Promise<AnalysisResult> => {
  try {
    const res = await api.post<AnalysisResult>('/logs/analyze', { logText });
    return res.data;
  } catch (err) {
    console.warn('[Argus API] Backend unreachable. Simulating NLP Analysis.', err);
    await new Promise((r) => setTimeout(r, 600));

    if (logText.toLowerCase().includes('powershell') || logText.toLowerCase().includes('encodedcommand')) {
      return {
        ...mockSampleAnalysis,
        category: 'Malware Activity',
        confidence: 0.982,
        summary: 'Encoded PowerShell execution detected via command line payload. Indicates obfuscated fileless malware execution stage.',
        recommendation: 'Isolate affected host immediately. Dump process memory and analyze PowerShell execution logs.',
      };
    }

    return mockSampleAnalysis;
  }
};

export const searchSemanticLogs = async (query: string): Promise<SemanticSearchResult[]> => {
  try {
    const res = await api.get<SemanticSearchResult[]>('/logs/semantic-search', { params: { query } });
    return res.data;
  } catch (err) {
    console.warn('[Argus API] Backend unreachable. Computing dynamic vector match.', err);
    await new Promise((r) => setTimeout(r, 350));

    const qTokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
    if (qTokens.length === 0) return mockSemanticSearchResults;

    const extendedCorpus: LogEntry[] = [
      ...mockRecentLogs,
      {
        id: 'LOG-9102',
        timestamp: '2026-07-29T18:11:00Z',
        source: 'Linux Syslog',
        service: 'sshd',
        user: 'admin',
        srcIp: '198.51.100.42',
        dstIp: '10.0.4.15',
        action: 'FAILED_LOGIN',
        message: 'Failed password for invalid user admin from 198.51.100.42 port 51092 ssh2',
        severity: 'error',
        category: 'BruteForce Attack',
      },
      {
        id: 'LOG-9088',
        timestamp: '2026-07-29T14:02:10Z',
        source: 'AWS CloudTrail',
        service: 's3.amazonaws.com',
        user: 'unknown-arn',
        srcIp: '203.0.113.195',
        dstIp: 's3-bucket-sensitive',
        action: 'PutBucketPolicy',
        message: 'PutBucketPolicy API call making bucket production-data publicly accessible',
        severity: 'critical',
        category: 'Privilege Escalation',
      },
      {
        id: 'LOG-8911',
        timestamp: '2026-07-28T22:30:00Z',
        source: 'Windows Event',
        service: 'Security Audit',
        user: 'SYSTEM',
        srcIp: '10.0.4.15',
        dstIp: '10.0.4.200',
        action: 'MIMIKATZ_LSASS_DUMP',
        message: 'LSASS process memory access by unauthorized process mimikatz.exe PID 4120',
        severity: 'critical',
        category: 'Malware Activity',
      },
    ];

    const scoredResults: SemanticSearchResult[] = [];

    extendedCorpus.forEach((log) => {
      const fullText = `${log.id} ${log.message} ${log.source} ${log.service} ${log.user || ''} ${log.srcIp || ''} ${log.category || ''} ${log.severity}`.toLowerCase();

      const matchedKeywords: string[] = [];
      let hits = 0;

      qTokens.forEach((token) => {
        if (fullText.includes(token)) {
          hits += 1;
          matchedKeywords.push(token);
        }
      });

      if (hits > 0) {
        const similarityScore = Math.min(0.98, parseFloat((0.68 + (hits / qTokens.length) * 0.28).toFixed(2)));
        scoredResults.push({
          log,
          similarityScore,
          matchedKeywords: Array.from(new Set(matchedKeywords)),
        });
      }
    });

    if (scoredResults.length === 0) {
      return mockSemanticSearchResults;
    }

    scoredResults.sort((a, b) => b.similarityScore - a.similarityScore);
    return scoredResults;
  }
};

// MongoDB Notifications API Functions
export const getNotifications = async (unreadOnly: boolean = false): Promise<NotificationItem[]> => {
  try {
    const res = await api.get<NotificationItem[]>('/notifications', { params: { unread_only: unreadOnly } });
    return res.data;
  } catch (err) {
    console.warn('[Argus API] MongoDB backend unreachable. Using local notifications.', err);
    return [
      {
        id: 'NOTIF-001',
        title: 'High-Frequency SSH BruteForce Detected',
        message: 'Origin IP 198.51.100.42 reached 48 failed password attempts targeting root.',
        timestamp: '5 mins ago',
        severity: 'critical',
        read: false,
        category: 'BruteForce Attack',
      },
      {
        id: 'NOTIF-002',
        title: 'Privilege Escalation Alert',
        message: 'User admin-temp executed AttachUserPolicy with AdministratorAccess on analyst_dev.',
        timestamp: '15 mins ago',
        severity: 'error',
        read: false,
        category: 'Privilege Escalation',
      },
      {
        id: 'NOTIF-003',
        title: 'Obfuscated PowerShell Execution Stage',
        message: 'Encoded PowerShell command executed on host 10.0.4.15.',
        timestamp: '25 mins ago',
        severity: 'critical',
        read: true,
        category: 'Malware Activity',
      },
      {
        id: 'NOTIF-004',
        title: 'Port Scan Detected',
        message: 'Sequential TCP SYN port sweep originating from IP 45.33.32.156.',
        timestamp: '1 hour ago',
        severity: 'warning',
        read: true,
        category: 'Reconnaissance Scan',
      },
      {
        id: 'NOTIF-005',
        title: 'System Model Pipeline Update',
        message: 'BERT classification model weights re-indexed and calibrated on latest log corpus.',
        timestamp: '3 hours ago',
        severity: 'info',
        read: true,
        category: 'System Telemetry',
      },
    ];
  }
};

export const markAllNotificationsRead = async (): Promise<void> => {
  try {
    await api.patch('/notifications/read-all');
  } catch (err) {
    console.warn('[Argus API] Could not sync read-all to MongoDB backend.', err);
  }
};

export const deleteNotification = async (id: string): Promise<void> => {
  try {
    await api.delete(`/notifications/${id}`);
  } catch (err) {
    console.warn(`[Argus API] Could not delete notification ${id} in MongoDB backend.`, err);
  }
};

export default api;
