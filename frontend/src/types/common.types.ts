export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  count: number;
}

export interface StatsData {
  students: { total: number };
  templates: { total: number; active: number };
  certificates: {
    pending: number;
    generated: number;
    sent: number;
    failed: number;
  };
  emails: { sent: number; failed: number };
}

export type CertificateStatus = 'pending' | 'generated' | 'sent' | 'failed';
