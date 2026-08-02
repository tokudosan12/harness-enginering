import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OpportunityApplication } from '@/shared/types/opportunity';
import type { AppNotification, StudentProfile } from '@/shared/types/user';

interface NotificationSettings {
  inApp: boolean;
  reminders: boolean;
  reminderDays: number;
  newMatches: boolean;
  marketingEmail: boolean;
  categories: string[];
}

interface StudentState {
  savedOpportunityIds: string[];
  reminderOpportunityIds: string[];
  notifications: AppNotification[];
  applications: OpportunityApplication[];
  profile: StudentProfile;
  settings: NotificationSettings;
  toggleSaved: (id: string) => void;
  toggleReminder: (id: string) => void;
  submitApplication: (application: OpportunityApplication) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  updateProfile: (profile: StudentProfile) => void;
  updateSettings: (settings: NotificationSettings) => void;
}

const defaultProfile: StudentProfile = {
  fullName: 'Nguyễn Minh Anh',
  email: 'student@example.com',
  university: 'Đại học Bách khoa Hà Nội',
  major: 'Công nghệ thông tin',
  studyYear: 'Năm 3',
  city: 'Hà Nội',
  bio: 'Mình quan tâm đến sản phẩm số, dữ liệu và các dự án tạo tác động tích cực.',
  interestedCategories: ['INTERNSHIP', 'HACKATHON', 'SCHOLARSHIP'],
  interestedFields: ['Công nghệ thông tin', 'Trí tuệ nhân tạo'],
  interestedSkills: ['React', 'TypeScript', 'AI/ML'],
  preferredLocations: ['Hà Nội', 'Toàn quốc'],
  preferredModes: ['ONLINE', 'HYBRID'],
};

const initialNotifications: AppNotification[] = [
  {
    id: 'not-1',
    type: 'DEADLINE',
    title: 'Cơ hội sắp hết hạn',
    message: 'Thực tập sinh Frontend Developer chỉ còn ít ngày để đăng ký.',
    createdAt: '2026-08-01T08:00:00.000Z',
    isRead: false,
    opportunityId: 'opp-01',
  },
  {
    id: 'not-2',
    type: 'MATCH',
    title: 'Cơ hội mới phù hợp với bạn',
    message: 'FPT University AI Hackathon khớp với sở thích AI/ML.',
    createdAt: '2026-07-31T10:00:00.000Z',
    isRead: false,
    opportunityId: 'opp-13',
  },
  {
    id: 'not-3',
    type: 'UPDATE',
    title: 'Cơ hội đã lưu có cập nhật',
    message: 'Học bổng Tài năng Công nghệ vừa cập nhật điều kiện tham gia.',
    createdAt: '2026-07-29T14:00:00.000Z',
    isRead: true,
    opportunityId: 'opp-17',
  },
];

export const useStudentStore = create<StudentState>()(
  persist(
    (set) => ({
      savedOpportunityIds: ['opp-01', 'opp-13', 'opp-17'],
      reminderOpportunityIds: ['opp-01', 'opp-17'],
      notifications: initialNotifications,
      applications: [],
      profile: defaultProfile,
      settings: {
        inApp: true,
        reminders: true,
        reminderDays: 3,
        newMatches: true,
        marketingEmail: false,
        categories: ['INTERNSHIP', 'HACKATHON', 'SCHOLARSHIP'],
      },
      toggleSaved: (id) =>
        set((state) => ({
          savedOpportunityIds: state.savedOpportunityIds.includes(id)
            ? state.savedOpportunityIds.filter((value) => value !== id)
            : [...state.savedOpportunityIds, id],
          reminderOpportunityIds: state.savedOpportunityIds.includes(id)
            ? state.reminderOpportunityIds.filter((value) => value !== id)
            : state.reminderOpportunityIds,
        })),
      toggleReminder: (id) =>
        set((state) => ({
          reminderOpportunityIds: state.reminderOpportunityIds.includes(id)
            ? state.reminderOpportunityIds.filter((value) => value !== id)
            : [...state.reminderOpportunityIds, id],
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((item) =>
            item.id === id ? { ...item, isRead: true } : item,
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((item) => ({ ...item, isRead: true })),
        })),
      deleteNotification: (id) =>
        set((state) => ({ notifications: state.notifications.filter((item) => item.id !== id) })),
      submitApplication: (application) =>
        set((state) => ({
          applications: [
            application,
            ...state.applications.filter((item) => item.opportunityId !== application.opportunityId),
          ],
        })),
      updateProfile: (profile) => set({ profile }),
      updateSettings: (settings) => set({ settings }),
    }),
    { name: 'soh-student-v1', version: 1 },
  ),
);
