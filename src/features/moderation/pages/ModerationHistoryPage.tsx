import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyTableState, WorkspacePageHeading } from '@/components/workspace/WorkspaceUI';
import { useOperationsStore } from '@/stores/operationsStore';

export function ModerationHistoryPage() {
  const [search, setSearch] = useState('');
  const audit = useOperationsStore((state) => state.audit);
  const history = useMemo(
    () =>
      audit.filter(
        (entry) =>
          ['kiểm duyệt', 'trạng thái', 'báo cáo', 'chỉnh sửa'].some((word) =>
            `${entry.action} ${entry.target}`.toLocaleLowerCase('vi').includes(word),
          ) &&
          (!search ||
            `${entry.action} ${entry.target}`
              .toLocaleLowerCase('vi')
              .includes(search.toLocaleLowerCase('vi'))),
      ),
    [audit, search],
  );
  return (
    <>
      <WorkspacePageHeading
        description="Dòng thời gian quyết định và thay đổi trạng thái nội dung."
        title="Lịch sử xử lý"
      />
      <section className="workspace-panel">
        <div className="workspace-toolbar">
          <label className="input-shell workspace-toolbar-search">
            <Search size={17} />
            <input
              aria-label="Tìm lịch sử"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm hành động hoặc nội dung..."
              value={search}
            />
          </label>
        </div>
        {history.length ? (
          <div className="workspace-timeline">
            {history.map((entry) => (
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
        ) : (
          <EmptyTableState
            title="Chưa có lịch sử phù hợp"
            description="Các quyết định kiểm duyệt sẽ xuất hiện tại đây."
          />
        )}
      </section>
    </>
  );
}
