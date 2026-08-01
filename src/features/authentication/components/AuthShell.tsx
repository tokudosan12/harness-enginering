import { ArrowLeft, ShieldCheck } from 'lucide-react';
import type { PropsWithChildren, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/common/BrandLogo';

export function AuthShell({
  title,
  description,
  children,
  aside,
}: PropsWithChildren<{ title: string; description: string; aside?: ReactNode }>) {
  return (
    <main className="auth-page">
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <BrandLogo />
          <Link
            className="text-muted-500 hover:text-primary-500 mt-10 inline-flex items-center gap-2 text-sm font-bold"
            to="/"
          >
            <ArrowLeft size={16} /> Trang chủ
          </Link>
          <div className="mt-10">
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </section>
      <aside className="auth-aside">
        <div className="auth-aside-art">
          <img alt="Sinh viên cùng chuẩn bị cho cơ hội mới" src="/assets/hero-students.png" />
        </div>
        <div className="auth-aside-content">
          <span>
            <ShieldCheck size={19} /> Dữ liệu demo được lưu trên trình duyệt
          </span>
          <h2>Mỗi cơ hội tốt bắt đầu từ một bước chuẩn bị rõ ràng.</h2>
          <p>{aside ?? 'Đăng nhập để lưu cơ hội, nhận nhắc hạn và quản lý sở thích của bạn.'}</p>
        </div>
      </aside>
    </main>
  );
}

export function FormField({
  label,
  error,
  children,
  htmlFor,
}: PropsWithChildren<{ label: string; error?: string; htmlFor: string }>) {
  const errorId = `${htmlFor}-error`;
  return (
    <label className="field-label" htmlFor={htmlFor}>
      {label}
      {children}
      {error ? (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
