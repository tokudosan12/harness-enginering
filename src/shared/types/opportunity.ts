export type OpportunityCategory =
  | 'INTERNSHIP'
  | 'STARTUP_JOB'
  | 'INNOVATION_COMPETITION'
  | 'HACKATHON'
  | 'SCHOLARSHIP'
  | 'INVESTMENT_FUND'
  | 'INCUBATION_PROGRAM';

export type ParticipationMode = 'ONLINE' | 'OFFLINE' | 'HYBRID';

export type OpportunityStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'REVISION_REQUIRED'
  | 'APPROVED'
  | 'OPEN'
  | 'HIDDEN'
  | 'EXPIRED'
  | 'CLOSED'
  | 'ARCHIVED';

export interface OrganizationSummary {
  id: string;
  name: string;
  isVerified: boolean;
}

export interface Opportunity {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: OpportunityCategory;
  organization: OrganizationSummary;
  coverImage?: string;
  fields: string[];
  skills: string[];
  tags: string[];
  targetAudience: string[];
  requirements: string[];
  benefits: string[];
  applicationMethod: string;
  applicationUrl: string;
  sourceUrl: string;
  contactEmail?: string;
  contactPhone?: string;
  participationMode: ParticipationMode;
  location?: string;
  publishedAt: string;
  applicationDeadline: string;
  eventStartAt?: string;
  eventEndAt?: string;
  status: OpportunityStatus;
  isFeatured: boolean;
  isPublic: boolean;
  viewCount: number;
  saveCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'PENDING' | 'SHORTLISTED' | 'REJECTED';

export interface OpportunityApplication {
  id: string;
  opportunityId: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  cvFileName: string;
  cvFileSize: number;
  submittedAt: string;
  status: ApplicationStatus;
}

export type OpportunitySort = 'newest' | 'deadline' | 'relevance';

export interface OpportunityFilters {
  search?: string;
  categories?: OpportunityCategory[];
  modes?: ParticipationMode[];
  fields?: string[];
  skills?: string[];
  locations?: string[];
  audiences?: string[];
  organizations?: string[];
  deadlineDays?: number;
  sort?: OpportunitySort;
}
