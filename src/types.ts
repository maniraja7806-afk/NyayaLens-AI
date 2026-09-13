export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'REVIEWER';
}

export interface Document {
  id: string;
  ownerId: string;
  filename: string;
  documentType: string;
  pageCount: number;
  status: 'processing' | 'completed' | 'error';
  createdAt: string;
  updatedAt: string;
}

export type AttentionLevel = 'informational' | 'review' | 'important' | 'critical';
export type ClauseCategory = 'PAYMENT' | 'OBLIGATION' | 'TERMINATION' | 'PENALTY' | 'DEADLINE' | 'PRIVACY' | 'RENEWAL' | 'RESTRICTION' | 'RESPONSIBILITY' | 'OTHER';

export interface Clause {
  id: string;
  documentId: string;
  pageNumber?: number;
  clauseNumber?: string;
  category: ClauseCategory;
  title: string;
  originalText: string;
  explanation: string;
  attentionLevel: AttentionLevel;
  attentionReason?: string;
  confidence: number;
}

export interface ImportantDate {
  id: string;
  documentId: string;
  date: string;
  event: string;
  description: string;
}

export interface ActionItem {
  id: string;
  documentId: string;
  task: string;
  reason: string;
}

export interface DocumentAnalysis {
  documentId: string;
  summary: string;
  documentType: string;
  confidence: number;
  clauses: Clause[];
  importantDates: ImportantDate[];
  actionPlan: ActionItem[];
}
