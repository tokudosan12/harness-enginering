import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, UserRole } from '@/shared/types/user';

interface MockAccount {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

const accounts: MockAccount[] = [
  { email: 'student@example.com', password: 'Student@123', name: 'Minh Anh', role: 'STUDENT' },
  { email: 'partner@example.com', password: 'Partner@123', name: 'Đối tác Demo', role: 'PARTNER' },
  {
    email: 'moderator@example.com',
    password: 'Moderator@123',
    name: 'Kiểm duyệt viên',
    role: 'MODERATOR',
  },
  {
    email: 'admin@example.com',
    password: 'Admin@123',
    name: 'Quản trị viên',
    role: 'ADMINISTRATOR',
  },
];

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        await new Promise<void>((resolve) => window.setTimeout(resolve, 650));
        const account = accounts.find(
          (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password,
        );
        if (!account) throw new Error('Email hoặc mật khẩu chưa đúng. Vui lòng kiểm tra lại.');
        const user: AuthUser = {
          id: `user-${account.role.toLowerCase()}`,
          name: account.name,
          email: account.email,
          role: account.role,
        };
        set({ user, isAuthenticated: true });
        return user;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'soh-auth-v1', version: 1 },
  ),
);

export function roleHome(role: UserRole): string {
  if (role === 'STUDENT') return '/student/dashboard';
  if (role === 'PARTNER') return '/partner/dashboard';
  if (role === 'MODERATOR') return '/moderator/review-queue';
  return '/admin/dashboard';
}
