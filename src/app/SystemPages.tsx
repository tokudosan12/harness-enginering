import { ArrowLeft, Construction, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { AccessDeniedState } from '@/components/feedback/StateViews';
import { BrandLogo } from '@/components/common/BrandLogo';

export function ForbiddenPage() {
  return (
    <main className="bg-canvas-50 grid min-h-screen place-items-center p-5">
      <div className="w-full max-w-2xl">
        <AccessDeniedState />
      </div>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main className="bg-canvas-50 grid min-h-screen place-items-center p-5">
      <div className="text-center">
        <span className="text-primary-100 text-8xl font-black tracking-[-.08em]">404</span>
        <h1 className="mt-3 text-3xl font-black">Trang bạn tìm chưa tồn tại</h1>
        <p className="text-muted-500 mt-3">
          Đường dẫn có thể đã thay đổi hoặc được nhập chưa chính xác.
        </p>
        <div className="mt-7 flex justify-center gap-2">
          <button className="btn btn-secondary" onClick={() => history.back()}>
            <ArrowLeft size={17} /> Quay lại
          </button>
          <Link className="btn btn-primary" to="/">
            <Home size={17} /> Trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}

export function FuturePhasePage({ area }: { area: 'Đối tác' | 'Kiểm duyệt' | 'Quản trị' }) {
  const location = useLocation();
  return (
    <main className="bg-canvas-50 min-h-screen p-5 md:p-10">
      <div className="mx-auto max-w-5xl">
        <BrandLogo />
        <div className="surface-card mt-10 grid min-h-[520px] place-items-center px-6 py-12 text-center">
          <div className="max-w-xl">
            <span className="bg-primary-50 text-primary-500 mx-auto grid size-16 place-items-center rounded-2xl">
              <Construction size={30} />
            </span>
            <p className="text-primary-500 mt-6 text-sm font-bold">Khu vực {area}</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-.035em]">
              Chức năng sẽ được triển khai trong giai đoạn tiếp theo
            </h1>
            <p className="text-muted-500 mt-4 leading-7">
              Route{' '}
              <code className="bg-primary-50 text-primary-600 rounded px-2 py-1">
                {location.pathname}
              </code>{' '}
              đã được cấu trúc sẵn để tích hợp quy trình nghiệp vụ và API sau MVP frontend.
            </p>
            <Link className="btn btn-primary mt-8" to="/">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
