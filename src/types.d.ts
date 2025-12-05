// API Response Types
export interface QueryResponse {
  decision: 'allowed' | 'blocked';
  classifier_prob: number;
  rule_matches: string[];
  llm_response?: string;
  explanation?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  query: string;
  decision: 'allowed' | 'blocked';
  classifier_prob: number;
  rule_matches: string[];
  user_id?: string;
  session_id?: string;
}

export interface ApiError {
  message: string;
  code?: string | number;
  details?: any;
}

export type DecisionType = 'allowed' | 'blocked';

// Security Types
export interface RateLimitState {
  count: number;
  resetTime: number;
  windowMs: number;
}

export interface QueryOptions {
  privacyNoise?: boolean;
  maxRetries?: number;
}

// UI State Types
export interface AppState {
  isLoading: boolean;
  error: string | null;
  currentQuery: string;
  lastResponse: QueryResponse | null;
  logs: LogEntry[];
}

// Component Props
export interface QueryFormProps {
  onSubmit: (query: string, options?: QueryOptions) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export interface ExplainPanelProps {
  response: QueryResponse | null;
  onShowRawContent?: (show: boolean) => void;
}

export interface LogsTableProps {
  logs: LogEntry[];
  onExportCsv: () => void;
}

export interface AdminPanelProps {
  logs: LogEntry[];
}

// Three.js Types
export interface ParticleSystemProps {
  count?: number;
  speed?: number;
  color?: string;
}

export interface CyberBackgroundProps {
  intensity?: number;
  animated?: boolean;
}