import type {
  OpportunityCategory,
  OpportunityStatus,
  ParticipationMode,
} from '@/shared/types/opportunity';
import type { UserRole } from '@/shared/types/user';

export interface PartnerPost {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: OpportunityCategory;
  mode: ParticipationMode;
  location: string;
  deadline: string;
  status: OpportunityStatus;
  updatedAt: string;
  views: number;
  saves: number;
  applications: number;
  reviewerNote?: string;
}

export interface OrganizationProfile {
  name: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  verified: boolean;
}

export interface ContentReport {
  id: string;
  opportunityTitle: string;
  reason: string;
  reporter: string;
  createdAt: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED';
  joinedAt: string;
  lastActiveAt: string;
}

export interface ManagedCategory {
  id: string;
  label: string;
  description: string;
  active: boolean;
  opportunityCount: number;
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface PartnerPostInput {
  title: string;
  summary: string;
  description: string;
  category: OpportunityCategory;
  mode: ParticipationMode;
  location: string;
  deadline: string;
}
