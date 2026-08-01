import { Menu, Search, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo } from '@/components/common/BrandLogo';
import { cn } from '@/lib/cn';
import { useAuthStore, roleHome } from '@/stores/authStore';

const navItems = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Khám phá cơ hội', to: '/opportunities' },
  { label: 'Sắp hết hạn', to: '/opportunities?sort=deadline' },
  { label: 'Giới thiệu', to: '/about' },
];

export function AppHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate(`/opportunities?search=${encodeURIComponent(search.trim())}`);
    setIsOpen(false);
  };

  return (
    <header className="public-header">
      <div className="page-container flex h-[72px] items-center justify-between gap-5">
        <BrandLogo />
        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  'header-nav-link',
                  isActive &&
                    item.to !== '/opportunities?sort=deadline' &&
                    'header-nav-link-active',
                )
              }
              end={item.to === '/'}
              key={item.label}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <form aria-label="Tìm nhanh" className="quick-search xl:flex" onSubmit={submitSearch}>
            <Search aria-hidden="true" size={17} />
            <input
              aria-label="Tìm nhanh cơ hội"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm nhanh..."
              value={search}
            />
          </form>
          {user ? (
            <Link className="btn btn-primary" to={roleHome(user.role)}>
              Vào trang của tôi
            </Link>
          ) : (
            <>
              <Link className="btn btn-secondary" to="/login">
                Đăng nhập
              </Link>
              <Link className="btn btn-primary" to="/register">
                Đăng ký
              </Link>
            </>
          )}
        </div>
        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
          className="mobile-menu-button lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {isOpen ? (
        <div className="mobile-menu lg:hidden">
          <nav aria-label="Điều hướng di động" className="page-container grid gap-1 py-4">
            {navItems.map((item) => (
              <NavLink
                className="mobile-nav-link"
                key={item.label}
                onClick={() => setIsOpen(false)}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
            <form className="input-shell mt-2" onSubmit={submitSearch}>
              <Search size={17} />
              <input
                aria-label="Tìm nhanh cơ hội"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Bạn đang tìm cơ hội nào?"
                value={search}
              />
            </form>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link className="btn btn-secondary" onClick={() => setIsOpen(false)} to="/login">
                Đăng nhập
              </Link>
              <Link className="btn btn-primary" onClick={() => setIsOpen(false)} to="/register">
                Đăng ký
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="page-container footer-grid">
        <div>
          <BrandLogo />
          <p className="text-muted-500 mt-4 max-w-xs text-sm leading-6">
            Nền tảng kết nối sinh viên với những cơ hội học tập, nghề nghiệp và phát triển đáng tin
            cậy.
          </p>
        </div>
        <div>
          <h2>Liên kết nhanh</h2>
          <Link to="/opportunities">Khám phá</Link>
          <Link to="/about">Giới thiệu</Link>
          <Link to="/login">Đăng nhập</Link>
        </div>
        <div>
          <h2>Nhóm cơ hội</h2>
          <Link to="/opportunities?category=INTERNSHIP">Thực tập</Link>
          <Link to="/opportunities?category=SCHOLARSHIP">Học bổng</Link>
          <Link to="/opportunities?category=HACKATHON">Hackathon</Link>
        </div>
        <div>
          <h2>Chính sách & liên hệ</h2>
          <span>Quyền riêng tư</span>
          <span>Điều khoản sử dụng</span>
          <a href="mailto:hello@studenthub.vn">hello@studenthub.vn</a>
        </div>
      </div>
      <div className="page-container border-line-200 text-muted-500 mt-10 border-t py-5 text-xs">
        © 2026 Student Opportunity Hub. Bản demo frontend sử dụng dữ liệu mẫu.
      </div>
    </footer>
  );
}

export function PublicLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>
      <AppHeader />
      <main id="main-content">
        <Outlet />
      </main>
      <AppFooter />
    </>
  );
}
