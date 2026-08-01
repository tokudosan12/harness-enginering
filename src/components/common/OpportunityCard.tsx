import {
  Bookmark,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Radio,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CATEGORY_COLORS, CATEGORY_LABELS, MODE_LABELS } from '@/shared/constants/opportunities';
import { formatDate, formatRelativeDays, getDaysRemaining } from '@/lib/date';
import { cn } from '@/lib/cn';
import { useAuthStore } from '@/stores/authStore';
import { useStudentStore } from '@/stores/studentStore';
import type { Opportunity } from '@/shared/types/opportunity';

interface OpportunityCardProps {
  opportunity: Opportunity;
  variant?: 'grid' | 'list' | 'compact';
}

export function OpportunityBadge({ opportunity }: { opportunity: Opportunity }) {
  const color = CATEGORY_COLORS[opportunity.category];
  return (
    <span className={cn('opportunity-badge', `opportunity-badge-${color}`)}>
      {CATEGORY_LABELS[opportunity.category]}
    </span>
  );
}

export function DeadlineBadge({ deadline }: { deadline: string }) {
  const days = getDaysRemaining(deadline);
  return (
    <span className={cn('deadline-badge', days <= 7 && days >= 0 && 'deadline-badge-urgent')}>
      <Clock3 aria-hidden="true" size={14} /> {formatRelativeDays(deadline)}
    </span>
  );
}

export function SaveOpportunityButton({ id }: { id: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const savedIds = useStudentStore((state) => state.savedOpportunityIds);
  const toggleSaved = useStudentStore((state) => state.toggleSaved);
  const isSaved = savedIds.includes(id);

  const handleSave = () => {
    if (!isAuthenticated || user?.role !== 'STUDENT') {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }
    toggleSaved(id);
  };

  return (
    <button
      aria-label={isSaved ? 'Bỏ lưu cơ hội' : 'Lưu cơ hội'}
      aria-pressed={isSaved}
      className={cn('save-button', isSaved && 'save-button-active')}
      onClick={handleSave}
      type="button"
    >
      <Bookmark aria-hidden="true" fill={isSaved ? 'currentColor' : 'none'} size={18} />
    </button>
  );
}

export function OpportunityCard({ opportunity, variant = 'grid' }: OpportunityCardProps) {
  if (variant === 'compact') {
    return (
      <article className="compact-opportunity">
        <img alt="" src={opportunity.coverImage} />
        <div className="min-w-0 flex-1">
          <Link
            className="text-navy-950 hover:text-primary-500 line-clamp-2 font-bold"
            to={`/opportunities/${opportunity.id}`}
          >
            {opportunity.title}
          </Link>
          <p className="text-muted-500 mt-1 text-xs">{opportunity.organization.name}</p>
        </div>
        <DeadlineBadge deadline={opportunity.applicationDeadline} />
      </article>
    );
  }

  return (
    <article
      className={cn('opportunity-card group', variant === 'list' && 'opportunity-card-list')}
    >
      <div className="opportunity-cover">
        <img alt={`Ảnh bìa ${opportunity.title}`} loading="lazy" src={opportunity.coverImage} />
        {opportunity.isFeatured ? <span className="featured-flag">Nổi bật</span> : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <OpportunityBadge opportunity={opportunity} />
          <SaveOpportunityButton id={opportunity.id} />
        </div>
        <Link
          className="text-navy-950 group-hover:text-primary-500 line-clamp-2 text-lg leading-6 font-extrabold tracking-[-0.02em]"
          to={`/opportunities/${opportunity.id}`}
        >
          {opportunity.title}
        </Link>
        <div className="text-ink-700 mt-2 flex items-center gap-1.5 text-sm font-semibold">
          <Building2 aria-hidden="true" size={15} />
          <span className="truncate">{opportunity.organization.name}</span>
          {opportunity.organization.isVerified ? (
            <CheckCircle2
              aria-label="Đơn vị đã xác minh"
              className="text-primary-500 shrink-0"
              size={14}
            />
          ) : null}
        </div>
        <div className="opportunity-meta">
          <span>
            <Radio aria-hidden="true" size={14} />
            {MODE_LABELS[opportunity.participationMode]}
          </span>
          <span>
            <MapPin aria-hidden="true" size={14} />
            {opportunity.location}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {opportunity.skills.slice(0, 3).map((skill) => (
            <span className="skill-chip" key={skill}>
              {skill}
            </span>
          ))}
        </div>
        <div className="border-line-200 mt-auto flex items-end justify-between gap-3 border-t pt-4">
          <div>
            <div className="text-muted-500 flex items-center gap-1.5 text-xs">
              <CalendarDays aria-hidden="true" size={14} /> Hạn{' '}
              {formatDate(opportunity.applicationDeadline)}
            </div>
            <DeadlineBadge deadline={opportunity.applicationDeadline} />
          </div>
          <Link
            className="btn btn-secondary min-h-10 px-3.5"
            to={`/opportunities/${opportunity.id}`}
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
}

export function OpportunityGrid({ opportunities }: { opportunities: Opportunity[] }) {
  return (
    <div className="opportunity-grid">
      {opportunities.map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
    </div>
  );
}
