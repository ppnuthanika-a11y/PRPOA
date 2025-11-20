
export type UserRole = 'REQUESTER' | 'APPROVER_1' | 'APPROVER_2';

export enum PRStatus {
  DRAFT = 'DRAFT',
  PENDING_L1 = 'PENDING_L1',
  PENDING_L2 = 'PENDING_L2',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CONVERTED_TO_PO = 'CONVERTED_TO_PO'
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ApprovalLog {
  role: UserRole;
  action: 'APPROVE' | 'REJECT' | 'SUBMIT';
  date: string;
  comment?: string;
}

export interface PurchaseRequest {
  id: string;
  requesterName: string;
  department: string;
  date: string;
  justification: string;
  items: LineItem[];
  totalAmount: number;
  status: PRStatus;
  approvalHistory: ApprovalLog[];
  aiAnalysis?: string;
}

export interface PurchaseOrder {
  poNumber: string;
  prId: string;
  vendorName: string;
  generatedDate: string;
  prSnapshot: PurchaseRequest;
}

// New Interfaces for Management
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  approver1Id?: string; // Link to Approver 1
  approver2Id?: string; // Link to Approver 2
}

export interface ApprovalLimit {
  id: string;
  name: string;
  amount: number;
  description?: string;
}

// Fallback constant if no dynamic limit is found (kept for safety)
export const DEFAULT_APPROVAL_LIMIT = 50000;
