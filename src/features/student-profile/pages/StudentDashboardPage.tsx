import { Bell, Bookmark, CalendarClock, Compass, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { OpportunityCard } from '@/components/common/OpportunityCard';
import { LoadingState } from '@/components/feedback/StateViews';
import { getPublicOpportunities } from '@/mocks/services/opportunityService';
import { useAuthStore } from '@/stores/authStore';
import { useStudentStore } from '@/stores/studentStore';

export function StudentDashboardPage() {
  const name = useAuthStore((state) => state.user?.name ?? 'Sinh viên');
  const savedIds = useStudentStore((state) => state.savedOpportunityIds);
  const notifications = useStudentStore((state) => state.notifications);
  const query = useQuery({
    queryKey: ['dashboard-opportunities'],
    queryFn: () => getPublicOpportunities({ sort: 'relevance' }),
  });
  const suggestions = query.data?.slice(0, 3) ?? [];
  const nearDeadlines = query.data?.filter((item) => savedIds.includes(item.id)).slice(0, 3) ?? [];

  return (
    <div>
      <div className="dashboard-heading">
        <div>
          <h1>Chào buổi sáng, {name}</h1>
          <p>Những cơ hội đáng chú ý đang chờ bạn kiểm tra hôm nay.</p>
        </div>
        <Link className="btn btn-secondary" to="/student/profile">
          <Sparkles size={17} /> Cập nhật sở thích
        </Link>
      </div>
      <section className="summary-strip" aria-label="Tổng quan nhanh">
        <div>
          <span className="summary-icon">
            <Bookmark />
          </span>
          <strong>{savedIds.length}</strong>
          <small>Cơ hội đã lưu</small>
        </div>
        <div>
          <span className="summary-icon summary-icon-alert">
            <CalendarClock />
          </span>
          <strong>{nearDeadlines.length}</strong>
          <small>Sắp hết hạn</small>
        </div>
        <div>
          <span className="summary-icon">
            <Bell />
          </span>
          <strong>{notifications.filter((item) => !item.isRead).length}</strong>
          <small>Thông báo chưa đọc</small>
        </div>
      </section>
      {query.isLoading ? (
        <LoadingState />
      ) : (
        <div className="dashboard-grid">
          <section className="dashboard-main-panel">
            <div className="panel-heading">
              <div>
                <h2>Gợi ý cho bạn</h2>
                <p>Dựa trên sở thích công nghệ, AI và học bổng.</p>
              </div>
              <Link to="/opportunities">Xem tất cả</Link>
            </div>
            <div className="recommendation-list">
              {suggestions.map((item) => (
                <OpportunityCard key={item.id} opportunity={item} variant="list" />
              ))}
            </div>
          </section>
          <aside className="grid content-start gap-5">
            <section className="dashboard-side-panel">
              <div className="panel-heading">
                <h2>Đã xem gần đây</h2>
                <Link to="/opportunities">Xem tất cả</Link>
              </div>
              {(query.data ?? []).slice(3, 7).map((item) => (
                <OpportunityCard key={item.id} opportunity={item} variant="compact" />
              ))}
            </section>
            <section className="dashboard-side-panel deadline-panel">
              <div className="panel-heading">
                <div>
                  <h2>Cần chú ý</h2>
                  <p>Cơ hội đã lưu gần đến hạn.</p>
                </div>
                <CalendarClock className="text-coral-500" />
              </div>
              {nearDeadlines.length ? (
                nearDeadlines.map((item) => (
                  <OpportunityCard key={item.id} opportunity={item} variant="compact" />
                ))
              ) : (
                <div className="mini-empty">
                  <Compass />
                  <span>Chưa có cơ hội đã lưu gần hết hạn.</span>
                </div>
              )}
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
