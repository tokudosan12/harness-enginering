import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Flag,
  MapPin,
  Radio,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ApplyOpportunityDialog } from '@/components/common/ApplyOpportunityDialog';
import {
  DeadlineBadge,
  OpportunityBadge,
  SaveOpportunityButton,
} from '@/components/common/OpportunityCard';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback/StateViews';
import { Button } from '@/components/ui/Button';
import { formatDate, getDaysRemaining } from '@/lib/date';
import { getOpportunityById } from '@/mocks/services/opportunityService';
import { MODE_LABELS } from '@/shared/constants/opportunities';
import { useAuthStore } from '@/stores/authStore';
import { useStudentStore } from '@/stores/studentStore';

export function OpportunityDetailPage() {
  const { opportunityId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [shared, setShared] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const applications = useStudentStore((state) => state.applications);
  const query = useQuery({
    queryKey: ['opportunity', opportunityId],
    queryFn: () => getOpportunityById(opportunityId),
  });

  if (query.isLoading)
    return (
      <div className="page-container py-16">
        <LoadingState label="Đang tải chi tiết cơ hội..." />
      </div>
    );
  if (query.isError)
    return (
      <div className="page-container py-16">
        <ErrorState onRetry={() => void query.refetch()} />
      </div>
    );
  if (!query.data)
    return (
      <div className="page-container py-16">
        <EmptyState
          action={
            <Link className="btn btn-primary" to="/opportunities">
              Quay lại danh sách
            </Link>
          }
          description="Cơ hội có thể đã bị gỡ, ẩn hoặc đường dẫn chưa chính xác."
          title="Không tìm thấy cơ hội"
        />
      </div>
    );

  const opportunity = query.data;
  const canApply =
    opportunity.status === 'OPEN' && getDaysRemaining(opportunity.applicationDeadline) >= 0;
  const isApplied = applications.some((item) => item.opportunityId === opportunity.id);
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      setShared(false);
    }
  };
  const handleApplyClick = () => {
    if (!isAuthenticated || user?.role !== 'STUDENT') {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }
    setShowApplyDialog(true);
  };

  return (
    <div className="detail-page">
      <div className="page-container py-8">
        <Link
          className="text-muted-500 hover:text-primary-500 inline-flex items-center gap-2 text-sm font-bold"
          to="/opportunities"
        >
          <ArrowLeft size={16} /> Quay lại danh sách cơ hội
        </Link>
      </div>
      <section className="page-container detail-hero">
        <img alt={`Ảnh bìa ${opportunity.title}`} src={opportunity.coverImage} />
        <div className="detail-hero-copy">
          <div className="flex flex-wrap items-center gap-2">
            <OpportunityBadge opportunity={opportunity} />
            {opportunity.isFeatured ? (
              <span className="featured-inline">Cơ hội nổi bật</span>
            ) : null}
          </div>
          <h1>{opportunity.title}</h1>
          <p className="detail-organization">
            {opportunity.organization.name}{' '}
            {opportunity.organization.isVerified ? (
              <ShieldCheck aria-label="Đơn vị đã xác minh" size={17} />
            ) : null}
          </p>
          <div className="detail-meta">
            <span>
              <Radio size={16} />
              {MODE_LABELS[opportunity.participationMode]}
            </span>
            <span>
              <MapPin size={16} />
              {opportunity.location}
            </span>
            <span>
              <CalendarDays size={16} />
              Công bố {formatDate(opportunity.publishedAt)}
            </span>
          </div>
        </div>
      </section>
      <div className="page-container detail-layout">
        <article className="detail-content">
          <section>
            <h2>Giới thiệu cơ hội</h2>
            <p>{opportunity.description}</p>
            <p>{opportunity.summary}</p>
          </section>
          <section>
            <h2>Đối tượng và yêu cầu</h2>
            <ul>
              {[...opportunity.targetAudience, ...opportunity.requirements].map((item) => (
                <li key={item}>
                  <Check size={17} />
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Quyền lợi</h2>
            <ul>
              {opportunity.benefits.map((item) => (
                <li key={item}>
                  <Check size={17} />
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Kỹ năng và lĩnh vực</h2>
            <div className="flex flex-wrap gap-2">
              {[...opportunity.fields, ...opportunity.skills].map((item) => (
                <span className="skill-chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </section>
          <section>
            <h2>Cách đăng ký</h2>
            <p>{opportunity.applicationMethod}</p>
            <div className="source-note">
              <ShieldCheck size={20} />
              <div>
                <strong>Nguồn đã được ghi nhận</strong>
                <p>
                  Thông tin được tổng hợp từ liên kết chính thức của {opportunity.organization.name}
                  . Hãy kiểm tra lại điều kiện trước khi gửi hồ sơ.
                </p>
              </div>
            </div>
          </section>
          <button className="report-link" type="button">
            <Flag size={15} /> Báo cáo thông tin chưa chính xác
          </button>
        </article>
        <aside className="detail-action-card">
          <span className="text-muted-500 text-sm font-bold">Hạn đăng ký</span>
          <strong className="mt-2 text-2xl">{formatDate(opportunity.applicationDeadline)}</strong>
          <DeadlineBadge deadline={opportunity.applicationDeadline} />
          {!canApply ? (
            <div className="closed-notice">
              <AlertTriangle size={18} />
              Cơ hội đã hết hạn hoặc đóng đăng ký.
            </div>
          ) : null}
          {isApplied ? (
            <div className="applied-status mt-6">
              <CheckCircle2 size={18} /> Đã đăng ký
            </div>
          ) : (
            <Button className="mt-6 w-full" disabled={!canApply} onClick={handleApplyClick}>
              Đăng ký ngay
            </Button>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="border-line-200 flex min-h-11 items-center justify-center rounded-[11px] border">
              <SaveOpportunityButton id={opportunity.id} />
              <span className="text-sm font-bold">Lưu</span>
            </div>
            <Button onClick={() => void share()} variant="secondary">
              <Share2 size={16} />
              {shared ? 'Đã chép' : 'Chia sẻ'}
            </Button>
          </div>
          <dl className="detail-facts">
            <div>
              <dt>Lượt xem</dt>
              <dd>{opportunity.viewCount.toLocaleString('vi-VN')}</dd>
            </div>
            <div>
              <dt>Lượt lưu</dt>
              <dd>{opportunity.saveCount.toLocaleString('vi-VN')}</dd>
            </div>
            <div>
              <dt>Liên hệ</dt>
              <dd>{opportunity.contactEmail}</dd>
            </div>
          </dl>
        </aside>
      </div>
      {showApplyDialog ? (
        <ApplyOpportunityDialog
          onClose={() => setShowApplyDialog(false)}
          opportunity={opportunity}
        />
      ) : null}
    </div>
  );
}
