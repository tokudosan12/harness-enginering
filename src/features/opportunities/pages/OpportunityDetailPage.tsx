import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Check,
  ExternalLink,
  Flag,
  MapPin,
  Radio,
  Share2,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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

export function OpportunityDetailPage() {
  const { opportunityId = '' } = useParams();
  const [showExternalDialog, setShowExternalDialog] = useState(false);
  const [shared, setShared] = useState(false);
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
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      setShared(false);
    }
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
          <Button
            className="mt-6 w-full"
            disabled={!canApply}
            onClick={() => setShowExternalDialog(true)}
          >
            Đăng ký tại nguồn chính thức <ExternalLink size={16} />
          </Button>
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
      {showExternalDialog ? (
        <div
          className="dialog-wrap"
          role="dialog"
          aria-modal="true"
          aria-labelledby="external-title"
        >
          <button
            aria-label="Đóng hộp thoại"
            className="dialog-backdrop"
            onClick={() => setShowExternalDialog(false)}
          />
          <div className="dialog-card">
            <div className="flex items-start justify-between gap-4">
              <span className="bg-primary-50 text-primary-500 grid size-11 place-items-center rounded-xl">
                <ExternalLink />
              </span>
              <button
                aria-label="Đóng"
                className="save-button"
                onClick={() => setShowExternalDialog(false)}
              >
                <X size={18} />
              </button>
            </div>
            <h2 id="external-title">Bạn sắp rời Student Opportunity Hub</h2>
            <p>
              Trang đăng ký thuộc {opportunity.organization.name}. Hãy kiểm tra tên miền và không
              chia sẻ thông tin nhạy cảm ngoài yêu cầu chính thức.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button onClick={() => setShowExternalDialog(false)} variant="secondary">
                Ở lại
              </Button>
              <a
                className="btn btn-primary"
                href={opportunity.applicationUrl}
                rel="noreferrer"
                target="_blank"
              >
                Tiếp tục đăng ký <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
