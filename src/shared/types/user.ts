export type UserRole = 'STUDENT' | 'PARTNER' | 'MODERATOR' | 'ADMINISTRATOR';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface StudentProfile {
  fullName: string;
  email: string;
  university: string;
  major: string;
  studyYear: string;
  city: string;
  bio: string;
  interestedCategories: string[];
  interestedFields: string[];
  interestedSkills: string[];
  preferredLocations: string[];
  preferredModes: string[];
}

export interface AppNotification {
  id: string;
  type: 'DEADLINE' | 'MATCH' | 'UPDATE';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  opportunityId?: string;
}
