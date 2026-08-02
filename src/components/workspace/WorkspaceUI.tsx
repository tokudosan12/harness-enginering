import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { OpportunityStatus } from '@/shared/types/opportunity';

const statusLabels: Record<OpportunityStatus, string> = {
  DRAFT: 'Bản nháp',
  PENDING_REVIEW: 'Chờ duyệt',
  REVISION_REQUIRED: 'Cần chỉnh sửa',
  APPROVED: 'Đã duyệt',
  OPEN: 'Đang mở',
  HIDDEN: 'Đã ẩn',
  EXPIRED: 'Hết hạn',
  CLOSED: 'Đã đóng',
  ARCHIVED: 'Lưu trữ',
};

export function WorkspacePageHeading({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="workspace-page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className="workspace-heading-actions">{actions}</div> : null}
    </header>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  trend = 'flat',
  icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  trend?: 'up' | 'down' | 'flat';
  icon: ReactNode;
}) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  return (
    <article className="workspace-metric-card">
      <div className="workspace-metric-top">
        <span>{label}</span>
        <div>{icon}</div>
      </div>
      <strong>{value}</strong>
      <small className={cn(`trend-${trend}`)}>
        <TrendIcon size={15} /> {detail}
      </small>
    </article>
  );
}

export function StatusBadge({ status }: { status: OpportunityStatus }) {
  return (
    <span className={cn('workspace-status', `workspace-status-${status.toLowerCase()}`)}>
      {statusLabels[status]}
    </span>
  );
}

export function EmptyTableState({ title, description }: { title: string; description: string }) {
  return (
    <div className="workspace-empty-row">
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="workspace-progress">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="workspace-progress-track">
        <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}
