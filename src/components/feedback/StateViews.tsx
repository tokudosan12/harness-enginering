import { AlertTriangle, Inbox, LoaderCircle, LockKeyhole, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

interface StateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

function StateFrame({ icon, title, description, action }: StateProps & { icon: ReactNode }) {
  return (
    <div
      className="surface-card grid min-h-64 place-items-center px-6 py-12 text-center"
      role="status"
    >
      <div className="max-w-md">
        <div className="bg-primary-50 text-primary-500 mx-auto mb-5 grid size-14 place-items-center rounded-2xl">
          {icon}
        </div>
        <h2 className="text-navy-950 text-xl font-extrabold tracking-[-0.02em]">{title}</h2>
        <p className="text-muted-500 mt-2 leading-7">{description}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </div>
  );
}

export function LoadingState({ label = 'Đang tải dữ liệu...' }: { label?: string }) {
  return (
    <div className="grid min-h-64 place-items-center" role="status">
      <div className="text-muted-500 flex items-center gap-3 font-semibold">
        <LoaderCircle aria-hidden="true" className="text-primary-500 animate-spin" /> {label}
      </div>
    </div>
  );
}

export function EmptyState({ title, description, action }: StateProps) {
  return (
    <StateFrame
      icon={<Inbox aria-hidden="true" />}
      title={title}
      description={description}
      action={action}
    />
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <StateFrame
      icon={<AlertTriangle aria-hidden="true" />}
      title="Chưa thể tải dữ liệu"
      description="Kết nối đang gián đoạn. Dữ liệu bạn đã nhập vẫn được giữ lại; hãy thử lại sau ít phút."
      action={
        onRetry ? (
          <Button onClick={onRetry}>
            <RotateCcw size={16} /> Thử lại
          </Button>
        ) : undefined
      }
    />
  );
}

export function AccessDeniedState() {
  return (
    <StateFrame
      icon={<LockKeyhole aria-hidden="true" />}
      title="Bạn chưa có quyền truy cập"
      description="Nội dung của khu vực này chỉ dành cho vai trò được cấp quyền."
      action={
        <Link className="btn btn-primary" to="/">
          Về trang chủ
        </Link>
      }
    />
  );
}
