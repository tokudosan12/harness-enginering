import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Code2,
  GraduationCap,
  HandCoins,
  Lightbulb,
  Rocket,
  Search,
  Trophy,
  UserRound,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OpportunityGrid } from '@/components/common/OpportunityCard';
import { CardSkeleton } from '@/components/feedback/CardSkeleton';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '@/shared/constants/opportunities';
import {
  getExpiringOpportunities,
  getFeaturedOpportunities,
  getLatestOpportunities,
} from '@/mocks/services/opportunityService';
import type { OpportunityCategory } from '@/shared/types/opportunity';

const icons: Record<OpportunityCategory, ReactNode> = {
  INTERNSHIP: <BriefcaseBusiness />,
  STARTUP_JOB: <Rocket />,
  INNOVATION_COMPETITION: <Lightbulb />,
  HACKATHON: <Code2 />,
  SCHOLARSHIP: <GraduationCap />,
  INVESTMENT_FUND: <HandCoins />,
  INCUBATION_PROGRAM: <Building2 />,
};

function OpportunitySection({
  title,
  queryKey,
  queryFn,
}: {
  title: string;
  queryKey: string;
  queryFn: typeof getFeaturedOpportunities;
}) {
  const query = useQuery({ queryKey: [queryKey], queryFn });
  return (
    <section className="section-space pt-0">
      <div className="mb-7 flex items-end justify-between gap-4">
        <h2 className="section-heading">{title}</h2>
        <Link
          className="text-primary-500 hover:text-primary-600 inline-flex items-center gap-2 text-sm font-bold"
          to="/opportunities"
        >
          Xem tất cả <ArrowRight size={16} />
        </Link>
      </div>
      {query.isLoading ? (
        <div className="opportunity-grid">
          {Array.from({ length: 4 }, (_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <OpportunityGrid opportunities={query.data ?? []} />
      )}
    </section>
  );
}

export function HomePage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate(`/opportunities?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      <section className="hero-section">
        <div className="page-container hero-grid">
          <div className="hero-copy">
            <h1>Mở đúng cánh cửa cho hành trình của bạn</h1>
            <p>
              Tìm kiếm những cơ hội đáng tin cậy về thực tập, việc làm startup, cuộc thi, hackathon,
              học bổng, quỹ đầu tư và chương trình ươm tạo — tất cả ở một nơi.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/opportunities">
                Khám phá cơ hội <ArrowRight size={17} />
              </Link>
              <Link className="btn btn-secondary" to="/partner">
                Dành cho đối tác <UserRound size={17} />
              </Link>
            </div>
            <form className="hero-search" onSubmit={submit}>
              <Search aria-hidden="true" />
              <input
                aria-label="Tìm cơ hội"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Bạn đang tìm cơ hội nào?"
                value={search}
              />
              <button className="btn btn-primary" type="submit">
                Tìm kiếm
              </button>
            </form>
          </div>
          <div className="hero-media">
            <img
              alt="Nhóm sinh viên cùng khám phá cơ hội trên máy tính bảng"
              src="/assets/hero-students.png"
            />
            <span className="hero-route-line" aria-hidden="true" />
          </div>
        </div>
      </section>

      <div className="page-container">
        <section className="category-section">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-heading">Khám phá theo danh mục</h2>
              <p className="section-copy mt-2">Bảy hướng đi, một điểm bắt đầu rõ ràng.</p>
            </div>
            <Link
              className="text-primary-500 hidden text-sm font-bold md:block"
              to="/opportunities"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="category-rail">
            {ALL_CATEGORIES.map((category) => (
              <Link
                className="category-card"
                key={category}
                to={`/opportunities?category=${category}`}
              >
                <span>{icons[category]}</span>
                <strong>{CATEGORY_LABELS[category]}</strong>
                <small>Khám phá ngay</small>
              </Link>
            ))}
          </div>
        </section>
        <OpportunitySection
          queryFn={getFeaturedOpportunities}
          queryKey="featured"
          title="Cơ hội nổi bật"
        />
        <OpportunitySection
          queryFn={getLatestOpportunities}
          queryKey="latest"
          title="Mới dành cho bạn"
        />
        <OpportunitySection
          queryFn={getExpiringOpportunities}
          queryKey="expiring"
          title="Sắp hết hạn"
        />
      </div>

      <section className="how-section">
        <div className="page-container">
          <h2 className="section-heading">Bắt đầu chỉ với 3 bước</h2>
          <div className="steps-grid">
            <div>
              <span>01</span>
              <Search />
              <h3>Tìm cơ hội phù hợp</h3>
              <p>Dùng từ khóa và bộ lọc để thu hẹp lựa chọn.</p>
            </div>
            <div>
              <span>02</span>
              <BookmarkStep />
              <h3>Lưu và theo dõi</h3>
              <p>Giữ những cơ hội quan trọng trong một danh sách.</p>
            </div>
            <div>
              <span>03</span>
              <Trophy />
              <h3>Đăng ký đúng hạn</h3>
              <p>Nhận nhắc hạn và đi đến nguồn chính thức an toàn.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="page-container stats-grid">
          <div>
            <strong>28+</strong>
            <span>Cơ hội mẫu đã chuẩn hóa</span>
          </div>
          <div>
            <strong>7</strong>
            <span>Nhóm cơ hội trọng tâm</span>
          </div>
          <div>
            <strong>1</strong>
            <span>Nơi tập trung để bắt đầu</span>
          </div>
          <div>
            <strong>360px+</strong>
            <span>Trải nghiệm web responsive</span>
          </div>
        </div>
      </section>
      <section className="page-container cta-section">
        <div>
          <h2>Cơ hội đang chờ bạn</h2>
          <p>Đừng bỏ lỡ cánh cửa phù hợp với đam mê và năng lực của bạn.</p>
        </div>
        <Link className="btn text-primary-600 bg-white" to="/opportunities">
          Khám phá cơ hội ngay <ArrowRight size={17} />
        </Link>
      </section>
    </>
  );
}

function BookmarkStep() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path
        d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3-6 3V4.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
