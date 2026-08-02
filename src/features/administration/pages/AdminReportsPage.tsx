import { BarChart3, Download, FileCheck2, ShieldAlert, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MetricCard, ProgressBar, WorkspacePageHeading } from '@/components/workspace/WorkspaceUI';
import { useOperationsStore } from '@/stores/operationsStore';

export function AdminReportsPage() {
  const posts = useOperationsStore((state) => state.posts);
  const users = useOperationsStore((state) => state.users);
  const reports = useOperationsStore((state) => state.reports);
  const exportCsv = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Users', String(users.length)],
      ['Posts', String(posts.length)],
      ['Open reports', String(reports.filter((report) => report.status === 'OPEN').length)],
      ...posts.map((post) => [`Post: ${post.title}`, String(post.views)]),
    ];
    const blob = new Blob(
      [
        rows
          .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
          .join('\n'),
      ],
      { type: 'text/csv;charset=utf-8' },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'student-opportunity-hub-report.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <WorkspacePageHeading
        actions={
          <Button onClick={exportCsv} variant="secondary">
            <Download size={17} /> Xuất CSV
          </Button>
        }
        description="Tổng hợp dữ liệu vận hành để theo dõi tăng trưởng và chất lượng nội dung."
        title="Báo cáo vận hành"
      />
      <section className="workspace-metric-grid workspace-metric-grid-3">
        <MetricCard
          icon={<UsersRound />}
          label="Người dùng hoạt động"
          value={users.filter((user) => user.status === 'ACTIVE').length}
          detail="Trên tổng tài khoản"
          trend="up"
        />
        <MetricCard
          icon={<FileCheck2 />}
          label="Tỷ lệ bài công khai"
          value={`${Math.round((posts.filter((post) => post.status === 'OPEN').length / Math.max(posts.length, 1)) * 100)}%`}
          detail="Sau kiểm duyệt"
          trend="flat"
        />
        <MetricCard
          icon={<ShieldAlert />}
          label="Tỷ lệ report mở"
          value={`${Math.round((reports.filter((report) => report.status === 'OPEN').length / Math.max(reports.length, 1)) * 100)}%`}
          detail="Cần tiếp tục xử lý"
          trend="down"
        />
      </section>
      <div className="workspace-dashboard-grid">
        <section className="workspace-panel workspace-panel-wide">
          <div className="workspace-panel-heading">
            <div>
              <h2>Hiệu quả nội dung</h2>
              <p>Lượt xem theo bài đăng của đối tác demo.</p>
            </div>
            <BarChart3 size={20} />
          </div>
          <div className="workspace-bar-chart">
            {posts.map((post) => {
              const max = Math.max(...posts.map((item) => item.views), 1);
              return (
                <div key={post.id}>
                  <span>{post.title}</span>
                  <div>
                    <i style={{ width: `${Math.max(3, (post.views / max) * 100)}%` }} />
                  </div>
                  <strong>{post.views}</strong>
                </div>
              );
            })}
          </div>
        </section>
        <aside className="workspace-panel">
          <div className="workspace-panel-heading">
            <div>
              <h2>Chất lượng dữ liệu</h2>
              <p>Độ hoàn thiện của dữ liệu mock.</p>
            </div>
          </div>
          <div className="workspace-progress-list">
            <ProgressBar label="Nguồn được xác minh" value={88} />
            <ProgressBar label="Có đủ deadline" value={100} />
            <ProgressBar label="Có thông tin liên hệ" value={94} />
            <ProgressBar label="Không trùng lặp" value={91} />
          </div>
        </aside>
      </div>
    </>
  );
}
