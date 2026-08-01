import {
  Bell,
  Bookmark,
  Compass,
  Home,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { BrandLogo } from '@/components/common/BrandLogo';
import { cn } from '@/lib/cn';
import { useAuthStore } from '@/stores/authStore';
import { useStudentStore } from '@/stores/studentStore';

const studentNav = [
  { label: 'Tổng quan', to: '/student/dashboard', icon: Home },
  { label: 'Khám phá cơ hội', to: '/opportunities', icon: Compass },
  { label: 'Cơ hội đã lưu', to: '/student/saved-opportunities', icon: Bookmark },
  { label: 'Thông báo', to: '/student/notifications', icon: Bell },
  { label: 'Hồ sơ', to: '/student/profile', icon: UserRound },
  { label: 'Cài đặt', to: '/student/settings', icon: Settings },
];

export function StudentLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const unread = useStudentStore(
    (state) => state.notifications.filter((item) => !item.isRead).length,
  );
  const location = useLocation();
  const current = studentNav.find((item) => location.pathname.startsWith(item.to));
  const doLogout = () => {
    logout();
    window.location.replace('/');
  };

  return (
    <div className="student-shell">
      <a className="skip-link" href="#student-main">
        Bỏ qua điều hướng
      </a>
      <aside className={cn('student-sidebar', isOpen && 'student-sidebar-open')}>
        <div className="flex items-center justify-between">
          <BrandLogo />
          <button
            aria-label="Đóng menu"
            className="mobile-menu-button lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X />
          </button>
        </div>
        <nav aria-label="Điều hướng sinh viên" className="mt-9 grid gap-2">
          {studentNav.map(({ icon: Icon, ...item }) => (
            <NavLink
              className={({ isActive }) =>
                cn('student-nav-link', isActive && 'student-nav-link-active')
              }
              key={item.label}
              onClick={() => setIsOpen(false)}
              to={item.to}
            >
              <Icon aria-hidden="true" size={20} />
              {item.label}
              {item.label === 'Thông báo' && unread > 0 ? (
                <span className="nav-count">{unread}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>
        <div className="student-interest-card">
          <div className="text-primary-500 grid size-12 place-items-center rounded-xl bg-white">
            <Compass />
          </div>
          <strong>Cập nhật sở thích</strong>
          <p>Nhận gợi ý phù hợp hơn với mục tiêu của bạn.</p>
          <Link className="btn btn-primary w-full" to="/student/profile">
            Cập nhật ngay
          </Link>
        </div>
        <button className="student-nav-link mt-auto" onClick={doLogout} type="button">
          <LogOut size={20} /> Đăng xuất
        </button>
      </aside>
      {isOpen ? (
        <button
          aria-label="Đóng lớp phủ menu"
          className="sidebar-backdrop"
          onClick={() => setIsOpen(false)}
        />
      ) : null}
      <div className="student-workspace">
        <header className="student-topbar">
          <button
            aria-label="Mở menu"
            className="mobile-menu-button lg:hidden"
            onClick={() => setIsOpen(true)}
          >
            <Menu />
          </button>
          <div className="text-muted-500 hidden text-sm md:block">
            Sinh viên <span className="mx-2">/</span>{' '}
            <strong className="text-navy-950">{current?.label ?? 'Tổng quan'}</strong>
          </div>
          <div className="student-search">
            <Search size={18} />
            <span>Tìm kiếm cơ hội, học bổng, sự kiện...</span>
          </div>
          <Link
            aria-label={`${unread} thông báo chưa đọc`}
            className="topbar-icon"
            to="/student/notifications"
          >
            <Bell />
            {unread > 0 ? <span>{unread}</span> : null}
          </Link>
          <div className="student-avatar" aria-label={`Tài khoản ${user?.name ?? 'Sinh viên'}`}>
            {user?.name.slice(0, 1) ?? 'S'}
          </div>
          <strong className="hidden text-sm md:block">{user?.name ?? 'Sinh viên'}</strong>
        </header>
        <main id="student-main" className="student-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
