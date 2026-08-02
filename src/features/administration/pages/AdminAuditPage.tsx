import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyTableState, WorkspacePageHeading } from '@/components/workspace/WorkspaceUI';
import type { AuditEntry } from '@/shared/types/operations';
import { useOperationsStore } from '@/stores/operationsStore';

export function AdminAuditPage() {
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState<'ALL' | AuditEntry['severity']>('ALL');
  const audit = useOperationsStore((state) => state.audit);
  const filtered = useMemo(
    () =>
      audit.filter(
        (entry) =>
          (severity === 'ALL' || entry.severity === severity) &&
          (!search ||
            `${entry.actor} ${entry.action} ${entry.target}`
              .toLocaleLowerCase('vi')
              .includes(search.toLocaleLowerCase('vi'))),
      ),
    [audit, search, severity],
  );
  return (
    <>
      <WorkspacePageHeading
        description="Theo dõi các thay đổi quan trọng để hỗ trợ truy vết và kiểm soát nội bộ."
        title="Nhật ký hệ thống"
      />
      <section className="workspace-panel">
        <div className="workspace-toolbar">
          <label className="input-shell workspace-toolbar-search">
            <Search size={17} />
            <input
              aria-label="Tìm nhật ký"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tác nhân, hành động hoặc đối tượng..."
              value={search}
            />
          </label>
          <label className="workspace-select-label">
            <span>Mức độ</span>
            <select
              className="field-control"
              onChange={(event) =>
                setSeverity(event.target.value as 'ALL' | AuditEntry['severity'])
              }
              value={severity}
            >
              <option value="ALL">Tất cả</option>
              <option value="INFO">Thông tin</option>
              <option value="WARNING">Cảnh báo</option>
              <option value="CRITICAL">Nghiêm trọng</option>
            </select>
          </label>
        </div>
        {filtered.length ? (
          <div className="workspace-table-wrap">
            <table className="workspace-table">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Tác nhân</th>
                  <th>Hành động</th>
                  <th>Đối tượng</th>
                  <th>Mức độ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id}>
                    <td>{new Date(entry.createdAt).toLocaleString('vi-VN')}</td>
                    <td>{entry.actor}</td>
                    <td>
                      <strong>{entry.action}</strong>
                    </td>
                    <td>{entry.target}</td>
                    <td>
                      <span className={`audit-severity severity-${entry.severity.toLowerCase()}`}>
                        {entry.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyTableState
            title="Không có bản ghi"
            description="Không tìm thấy hoạt động theo điều kiện hiện tại."
          />
        )}
      </section>
    </>
  );
}
