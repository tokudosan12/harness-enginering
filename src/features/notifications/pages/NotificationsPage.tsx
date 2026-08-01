import { Bell, BellRing, CheckCheck, Lightbulb, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/feedback/StateViews';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/date';
import { useStudentStore } from '@/stores/studentStore';

export function NotificationsPage() {
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const notifications = useStudentStore((state) => state.notifications);
  const markRead = useStudentStore((state) => state.markNotificationRead);
  const markAllRead = useStudentStore((state) => state.markAllNotificationsRead);
  const remove = useStudentStore((state) => state.deleteNotification);
  const filtered = notifications.filter(
    (item) => filter === 'ALL' || (filter === 'UNREAD' ? !item.isRead : item.isRead),
  );
  return (
    <div>
      <div className="dashboard-heading">
        <div>
          <h1>Thông báo</h1>
          <p>Theo dõi hạn đăng ký, cơ hội mới và thay đổi quan trọng.</p>
        </div>
        <Button
          disabled={!notifications.some((item) => !item.isRead)}
          onClick={markAllRead}
          variant="secondary"
        >
          <CheckCheck size={17} /> Đánh dấu tất cả đã đọc
        </Button>
      </div>
      <div className="notification-tabs" role="tablist" aria-label="Lọc thông báo">
        {(['ALL', 'UNREAD', 'READ'] as const).map((value) => (
          <button
            aria-selected={filter === value}
            className={filter === value ? 'active' : ''}
            key={value}
            onClick={() => setFilter(value)}
            role="tab"
            type="button"
          >
            {value === 'ALL' ? 'Tất cả' : value === 'UNREAD' ? 'Chưa đọc' : 'Đã đọc'}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          description="Không có thông báo trong nhóm đang chọn. Những cập nhật mới sẽ xuất hiện tại đây."
          title="Hộp thông báo đang trống"
        />
      ) : (
        <div className="notification-list">
          {filtered.map((item) => (
            <article
              className={cn('notification-row', !item.isRead && 'notification-unread')}
              key={item.id}
            >
              <span className="notification-icon">
                {item.type === 'DEADLINE' ? (
                  <BellRing />
                ) : item.type === 'MATCH' ? (
                  <Lightbulb />
                ) : (
                  <Bell />
                )}
              </span>
              <button
                className="min-w-0 flex-1 text-left"
                onClick={() => markRead(item.id)}
                type="button"
              >
                <span className="flex items-center gap-2">
                  <strong>{item.title}</strong>
                  {!item.isRead ? <i aria-label="Chưa đọc" /> : null}
                </span>
                <p>{item.message}</p>
                <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
              </button>
              {item.opportunityId ? (
                <Link className="btn btn-secondary" to={`/opportunities/${item.opportunityId}`}>
                  Xem cơ hội
                </Link>
              ) : null}
              <button
                aria-label={`Xóa thông báo ${item.title}`}
                className="save-button"
                onClick={() => remove(item.id)}
                type="button"
              >
                <Trash2 size={17} />
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
