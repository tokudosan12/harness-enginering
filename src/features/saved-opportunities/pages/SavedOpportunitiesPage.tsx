import { BellRing, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DeadlineBadge, OpportunityBadge } from '@/components/common/OpportunityCard';
import { EmptyState } from '@/components/feedback/StateViews';
import { Button } from '@/components/ui/Button';
import { mockOpportunities } from '@/mocks/data/opportunities';
import { CATEGORY_LABELS } from '@/shared/constants/opportunities';
import { useStudentStore } from '@/stores/studentStore';

export function SavedOpportunitiesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const savedIds = useStudentStore((state) => state.savedOpportunityIds);
  const reminderIds = useStudentStore((state) => state.reminderOpportunityIds);
  const toggleSaved = useStudentStore((state) => state.toggleSaved);
  const toggleReminder = useStudentStore((state) => state.toggleReminder);
  const items = useMemo(
    () =>
      mockOpportunities
        .filter((item) => savedIds.includes(item.id))
        .filter(
          (item) =>
            !search ||
            `${item.title} ${item.organization.name}`
              .toLocaleLowerCase('vi')
              .includes(search.toLocaleLowerCase('vi')),
        )
        .filter((item) => category === 'ALL' || item.category === category)
        .filter((item) => status === 'ALL' || item.status === status),
    [savedIds, search, category, status],
  );
  return (
    <div>
      <div className="dashboard-heading">
        <div>
          <h1>Cơ hội đã lưu</h1>
          <p>Quản lý danh sách quan tâm và bật nhắc hạn cho từng cơ hội.</p>
        </div>
        <Link className="btn btn-primary" to="/opportunities">
          Khám phá thêm
        </Link>
      </div>
      <div className="saved-toolbar">
        <div className="input-shell">
          <Search size={17} />
          <input
            aria-label="Tìm trong cơ hội đã lưu"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm trong danh sách đã lưu"
            value={search}
          />
        </div>
        <select
          aria-label="Lọc theo loại"
          className="field-control"
          onChange={(event) => setCategory(event.target.value)}
          value={category}
        >
          <option value="ALL">Tất cả loại</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          aria-label="Lọc theo trạng thái"
          className="field-control"
          onChange={(event) => setStatus(event.target.value)}
          value={status}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="OPEN">Đang mở</option>
          <option value="EXPIRED">Hết hạn</option>
          <option value="CLOSED">Đã đóng</option>
        </select>
      </div>
      {items.length === 0 ? (
        <EmptyState
          action={
            <Button
              onClick={() => {
                setSearch('');
                setCategory('ALL');
                setStatus('ALL');
              }}
            >
              Xóa bộ lọc
            </Button>
          }
          description="Bạn có thể khám phá thêm hoặc thay đổi bộ lọc hiện tại."
          title="Chưa có cơ hội phù hợp trong danh sách"
        />
      ) : (
        <div className="saved-list">
          {items.map((item) => (
            <article className="saved-row" key={item.id}>
              <img alt="" src={item.coverImage} />
              <div className="min-w-0">
                <OpportunityBadge opportunity={item} />
                <Link
                  className="text-navy-950 hover:text-primary-500 mt-2 block text-lg font-extrabold"
                  to={`/opportunities/${item.id}`}
                >
                  {item.title}
                </Link>
                <p>
                  {item.organization.name} · {item.location}
                </p>
                <DeadlineBadge deadline={item.applicationDeadline} />
              </div>
              <span className={`status-label status-${item.status.toLowerCase()}`}>
                {item.status === 'OPEN'
                  ? 'Đang mở'
                  : item.status === 'EXPIRED'
                    ? 'Hết hạn'
                    : 'Đã đóng'}
              </span>
              <div className="saved-actions">
                <Button
                  disabled={item.status !== 'OPEN'}
                  onClick={() => toggleReminder(item.id)}
                  variant={reminderIds.includes(item.id) ? 'primary' : 'secondary'}
                >
                  <BellRing size={16} />
                  {reminderIds.includes(item.id) ? 'Đang nhắc' : 'Bật nhắc'}
                </Button>
                <Button
                  aria-label={`Bỏ lưu ${item.title}`}
                  onClick={() => toggleSaved(item.id)}
                  variant="danger"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
