import { AlertTriangle, Clock3, Search, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EmptyTableState,
  MetricCard,
  StatusBadge,
  WorkspacePageHeading,
} from '@/components/workspace/WorkspaceUI';
import { CATEGORY_LABELS } from '@/shared/constants/opportunities';
import { useOperationsStore } from '@/stores/operationsStore';

export function ModerationQueuePage() {
  const [search, setSearch] = useState('');
  const posts = useOperationsStore((state) => state.posts);
  const reports = useOperationsStore((state) => state.reports);
  const queue = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase('vi');
    return posts.filter(
      (post) =>
        ['PENDING_REVIEW', 'REVISION_REQUIRED'].includes(post.status) &&
        (!keyword || post.title.toLocaleLowerCase('vi').includes(keyword)),
    );
  }, [posts, search]);

  return (
    <>
      <WorkspacePageHeading
        description="Ưu tiên nội dung mới, báo cáo rủi ro và các bài đã gửi lại sau chỉnh sửa."
        title="Hàng chờ kiểm duyệt"
      />
      <section className="workspace-metric-grid workspace-metric-grid-3">
        <MetricCard
          icon={<Clock3 />}
          label="Chờ kiểm duyệt"
          value={queue.filter((post) => post.status === 'PENDING_REVIEW').length}
          detail="Mục tiêu xử lý trong 24h"
          trend="flat"
        />
        <MetricCard
          icon={<AlertTriangle />}
          label="Báo cáo mở"
          value={reports.filter((report) => report.status === 'OPEN').length}
          detail="1 báo cáo ưu tiên cao"
          trend="down"
        />
        <MetricCard
          icon={<ShieldCheck />}
          label="Đã xử lý hôm nay"
          value="12"
          detail="Tỷ lệ đúng SLA 96%"
          trend="up"
        />
      </section>
      <section className="workspace-panel">
        <div className="workspace-toolbar">
          <label className="input-shell workspace-toolbar-search">
            <Search size={17} />
            <input
              aria-label="Tìm nội dung cần duyệt"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo tiêu đề..."
              value={search}
            />
          </label>
          <span className="workspace-result-count">{queue.length} mục cần xử lý</span>
        </div>
        {queue.length ? (
          <div className="workspace-review-list">
            {queue.map((post) => (
              <article className="workspace-review-row" key={post.id}>
                <div className="workspace-review-priority">
                  {post.status === 'REVISION_REQUIRED' ? 'Gửi lại' : 'Mới'}
                </div>
                <div>
                  <span>{CATEGORY_LABELS[post.category]}</span>
                  <h2>{post.title}</h2>
                  <p>{post.summary}</p>
                  <small>
                    Future Skills Vietnam · cập nhật{' '}
                    {new Date(post.updatedAt).toLocaleString('vi-VN')}
                  </small>
                </div>
                <StatusBadge status={post.status} />
                <Link className="btn btn-primary" to={`/moderator/review/${post.id}`}>
                  Mở kiểm duyệt
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <EmptyTableState
            title="Hàng chờ đã trống"
            description="Không còn bài phù hợp với từ khóa hiện tại."
          />
        )}
      </section>
    </>
  );
}
