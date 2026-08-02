import { BarChart3, Bookmark, Eye, FileCheck2, Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  MetricCard,
  ProgressBar,
  StatusBadge,
  WorkspacePageHeading,
} from '@/components/workspace/WorkspaceUI';
import { CATEGORY_LABELS } from '@/shared/constants/opportunities';
import { useOperationsStore } from '@/stores/operationsStore';

export function PartnerDashboardPage() {
  const posts = useOperationsStore((state) => state.posts);
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
  const totalSaves = posts.reduce((sum, post) => sum + post.saves, 0);
  const totalApplications = posts.reduce((sum, post) => sum + post.applications, 0);
  const openPosts = posts.filter((post) => post.status === 'OPEN').length;

  return (
    <>
      <WorkspacePageHeading
        actions={
          <Link className="btn btn-primary" to="/partner/posts/new">
            <Plus size={18} /> Tạo cơ hội mới
          </Link>
        }
        description="Theo dõi hiệu quả bài đăng và các việc cần xử lý hôm nay."
        title="Tổng quan đối tác"
      />
      <section className="workspace-metric-grid" aria-label="Chỉ số bài đăng">
        <MetricCard
          icon={<FileCheck2 />}
          label="Bài đang mở"
          value={openPosts}
          detail="Nội dung công khai"
          trend="up"
        />
        <MetricCard
          icon={<Eye />}
          label="Lượt xem"
          value={totalViews.toLocaleString('vi-VN')}
          detail="+18% trong 30 ngày"
          trend="up"
        />
        <MetricCard
          icon={<Bookmark />}
          label="Lượt lưu"
          value={totalSaves}
          detail="Tỷ lệ lưu 14,9%"
          trend="up"
        />
        <MetricCard
          icon={<Users />}
          label="Đăng ký"
          value={totalApplications}
          detail="27 hồ sơ mới"
          trend="up"
        />
      </section>

      <div className="workspace-dashboard-grid">
        <section className="workspace-panel workspace-panel-wide">
          <div className="workspace-panel-heading">
            <div>
              <h2>Bài đăng gần đây</h2>
              <p>Trạng thái mới nhất của các cơ hội thuộc tổ chức.</p>
            </div>
            <Link to="/partner/posts">Xem tất cả</Link>
          </div>
          <div className="workspace-table-wrap">
            <table className="workspace-table">
              <thead>
                <tr>
                  <th>Cơ hội</th>
                  <th>Danh mục</th>
                  <th>Trạng thái</th>
                  <th>Lượt xem</th>
                  <th>Đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {posts.slice(0, 5).map((post) => (
                  <tr key={post.id}>
                    <td>
                      <Link className="workspace-table-title" to={`/partner/posts/${post.id}/edit`}>
                        {post.title}
                      </Link>
                      <small>Cập nhật {new Date(post.updatedAt).toLocaleDateString('vi-VN')}</small>
                    </td>
                    <td>{CATEGORY_LABELS[post.category]}</td>
                    <td>
                      <StatusBadge status={post.status} />
                    </td>
                    <td>{post.views.toLocaleString('vi-VN')}</td>
                    <td>{post.applications}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <aside className="workspace-panel">
          <div className="workspace-panel-heading">
            <div>
              <h2>Hiệu quả chuyển đổi</h2>
              <p>30 ngày gần nhất</p>
            </div>
            <BarChart3 size={20} />
          </div>
          <div className="workspace-progress-list">
            <ProgressBar label="Xem → Lưu" value={15} />
            <ProgressBar label="Lưu → Đăng ký" value={40} />
            <ProgressBar label="Hoàn thiện hồ sơ" value={76} />
          </div>
          <div className="workspace-callout">
            <strong>Gợi ý cải thiện</strong>
            <p>Bài có mô tả quyền lợi rõ ràng đang nhận nhiều lượt lưu hơn 22%.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
