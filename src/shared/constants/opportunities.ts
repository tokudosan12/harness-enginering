import type { OpportunityCategory, ParticipationMode } from '@/shared/types/opportunity';

export const CATEGORY_LABELS: Record<OpportunityCategory, string> = {
  INTERNSHIP: 'Thực tập',
  STARTUP_JOB: 'Việc làm startup',
  INNOVATION_COMPETITION: 'Cuộc thi đổi mới',
  HACKATHON: 'Hackathon',
  SCHOLARSHIP: 'Học bổng',
  INVESTMENT_FUND: 'Quỹ đầu tư',
  INCUBATION_PROGRAM: 'Chương trình ươm tạo',
};

export const MODE_LABELS: Record<ParticipationMode, string> = {
  ONLINE: 'Trực tuyến',
  OFFLINE: 'Trực tiếp',
  HYBRID: 'Kết hợp',
};

export const CATEGORY_COLORS: Record<OpportunityCategory, string> = {
  INTERNSHIP: 'blue',
  STARTUP_JOB: 'orange',
  INNOVATION_COMPETITION: 'amber',
  HACKATHON: 'violet',
  SCHOLARSHIP: 'green',
  INVESTMENT_FUND: 'rose',
  INCUBATION_PROGRAM: 'cyan',
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as OpportunityCategory[];
export const ALL_MODES = Object.keys(MODE_LABELS) as ParticipationMode[];
