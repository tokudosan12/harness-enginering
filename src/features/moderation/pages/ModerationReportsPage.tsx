import { CheckCircle2, Eye, Search, ShieldAlert, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EmptyTableState, WorkspacePageHeading } from '@/components/workspace/WorkspaceUI';
import type { ContentReport } from '@/shared/types/operations';
import { useOperationsStore } from '@/stores/operationsStore';

const reportStatusLabel: Record<ContentReport['status'], string> = {
  OPEN: 'Mới',
  INVESTIGATING: 'Đang xác minh',
  RESOLVED: 'Đã xử lý',
  DISMISSED: 'Bỏ qua',
};

export function ModerationReportsPage() {
  const [filter, setFilter] = useState<'ALL' | ContentReport['status']>('ALL');
  const [search, setSearch] = useState('');
  const reports = useOperationsStore((state) => state.reports);
  const updateReport = useOperationsStore((state) => state.updateReport);
  const filtered = useMemo(
    () =>
      reports.filter(
        (report) =>
          (filter === 'ALL' || report.status === filter) &&
          (!search ||
            report.opportunityTitle
              .toLocaleLowerCase('vi')
              .includes(search.toLocaleLowerCase('vi'))),
      ),
    [filter, reports, search],
  );

  return (
    <>
      <WorkspacePageHeading
        description="Xác minh phản ánh của cộng đồng và lưu lại kết quả xử lý minh bạch."
        title="Báo cáo nội dung"
      />
      <section className="workspace-panel">
        <div className="workspace-toolbar">
          <label className="input-shell workspace-toolbar-search">
            <Search size={17} />
            <input
              aria-label="Tìm báo cáo"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm cơ hội bị báo cáo..."
              value={search}
            />
          </label>
          <label className="workspace-select-label">
            <span>Trạng thái</span>
            <select
              className="field-control"
              onChange={(event) => setFilter(event.target.value as 'ALL' | ContentReport['status'])}
              value={filter}
            >
              <option value="ALL">Tất cả</option>
              {Object.entries(reportStatusLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {filtered.length ? (
          <div className="workspace-report-list">
            {filtered.map((report) => (
              <article className="workspace-report-row" key={report.id}>
                <div
                  className={`workspace-report-priority priority-${report.priority.toLowerCase()}`}
                >
                  <ShieldAlert size={19} />
                  {report.priority}
                </div>
                <div>
                  <h2>{report.opportunityTitle}</h2>
                  <p>{report.reason}</p>
                  <small>
                    Báo bởi {report.reporter} · {new Date(report.createdAt).toLocaleString('vi-VN')}
                  </small>
                </div>
                <span className={`report-status report-status-${report.status.toLowerCase()}`}>
                  {reportStatusLabel[report.status]}
                </span>
                <div className="workspace-row-actions">
                  {report.status === 'OPEN' ? (
                    <Button
                      aria-label="Bắt đầu xác minh"
                      onClick={() => updateReport(report.id, 'INVESTIGATING')}
                      variant="secondary"
                    >
                      <Eye size={16} />
                    </Button>
                  ) : null}
                  {!['RESOLVED', 'DISMISSED'].includes(report.status) ? (
                    <Button
                      aria-label="Đánh dấu đã xử lý"
                      onClick={() => updateReport(report.id, 'RESOLVED')}
                    >
                      <CheckCircle2 size={16} />
                    </Button>
                  ) : null}
                  {report.status !== 'DISMISSED' ? (
                    <Button
                      aria-label="Bỏ qua báo cáo"
                      onClick={() => updateReport(report.id, 'DISMISSED')}
                      variant="ghost"
                    >
                      <XCircle size={16} />
                    </Button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyTableState
            title="Không có báo cáo"
            description="Không tìm thấy báo cáo theo điều kiện hiện tại."
          />
        )}
      </section>
    </>
  );
}
