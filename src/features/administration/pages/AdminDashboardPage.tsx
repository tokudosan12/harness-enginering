import { Activity, FileCheck2, ShieldAlert, Tags, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MetricCard, ProgressBar, WorkspacePageHeading } from '@/components/workspace/WorkspaceUI';
import { useOperationsStore } from '@/stores/operationsStore';

export function AdminDashboardPage() {
  const users = useOperationsStore((state) => state.users);
  const posts = useOperationsStore((state) => state.posts);
  const reports = useOperationsStore((state) => state.reports);
  const categories = useOperationsStore((state) => state.categories);
  const audit = useOperationsStore((state) => state.audit);
  return (
    <>
      <WorkspacePageHeading
        description="Theo dõi sức khỏe hệ thống, người dùng và luồng kiểm duyệt trong một màn hình."
        title="Tổng quan hệ thống"
      />
      <section className="workspace-metric-grid">
        <MetricCard
          icon={<UsersRound />}
          label="Người dùng"
          value={users.length.toLocaleString('vi-VN')}
          detail="+8,4% tháng này"
          trend="up"
        />
        <MetricCard
          icon={<FileCheck2 />}
          label="Nội dung"
          value={posts.length}
          detail={`${posts.filter((post) => post.status === 'OPEN').length} bài đang mở`}
          trend="up"
        />
        <MetricCard
          icon={<ShieldAlert />}
          label="Báo cáo mở"
          value={
            reports.filter((report) => !['RESOLVED', 'DISMISSED'].includes(report.status)).length
          }
          detail="Trong ngưỡng vận hành"
          trend="flat"
        />
        <MetricCard
          icon={<Tags />}
          label="Danh mục hoạt động"
          value={categories.filter((category) => category.active).length}
          detail="Phủ đủ nhóm cơ hội"
          trend="flat"
        />
      </section>
      <div className="workspace-dashboard-grid">
        <section className="workspace-panel workspace-panel-wide">
          <div className="workspace-panel-heading">
            <div>
              <h2>Hoạt động gần đây</h2>
              <p>Những thay đổi quan trọng trên toàn hệ thống.</p>
            </div>
            <Link to="/admin/audit">Mở audit log</Link>
          </div>
          <div className="workspace-timeline">
            {audit.slice(0, 6).map((entry) => (
              <article key={entry.id}>
                <span className={`audit-dot severity-${entry.severity.toLowerCase()}`} />
                <div>
                  <strong>{entry.action}</strong>
                  <p>{entry.target}</p>
                  <small>
                    {entry.actor} · {new Date(entry.createdAt).toLocaleString('vi-VN')}
                  </small>
                </div>
              </article>
            ))}
          </div>
        </section>
        <aside className="workspace-panel">
          <div className="workspace-panel-heading">
            <div>
              <h2>Sức khỏe vận hành</h2>
              <p>Cập nhật theo mock data hiện tại.</p>
            </div>
            <Activity size={20} />
          </div>
          <div className="workspace-progress-list">
            <ProgressBar label="Uptime frontend" value={99} />
            <ProgressBar label="Đúng SLA kiểm duyệt" value={96} />
            <ProgressBar label="Hồ sơ tổ chức xác minh" value={84} />
            <ProgressBar label="Link nguồn hợp lệ" value={92} />
          </div>
          <div className="workspace-callout workspace-callout-success">
            <strong>Hệ thống ổn định</strong>
            <p>Không có sự cố nghiêm trọng trong 24 giờ qua.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
