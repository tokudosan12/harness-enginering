import { Edit3, Eye, Plus, Search, Send, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import {
  EmptyTableState,
  StatusBadge,
  WorkspacePageHeading,
} from '@/components/workspace/WorkspaceUI';
import { CATEGORY_LABELS } from '@/shared/constants/opportunities';
import type { OpportunityStatus } from '@/shared/types/opportunity';
import { useOperationsStore } from '@/stores/operationsStore';

const postFilters: Array<{ label: string; value: 'ALL' | OpportunityStatus }> = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Bản nháp', value: 'DRAFT' },
  { label: 'Chờ duyệt', value: 'PENDING_REVIEW' },
  { label: 'Cần chỉnh sửa', value: 'REVISION_REQUIRED' },
  { label: 'Đang mở', value: 'OPEN' },
  { label: 'Đã đóng', value: 'CLOSED' },
];

export function PartnerPostsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'ALL' | OpportunityStatus>('ALL');
  const posts = useOperationsStore((state) => state.posts);
  const changePostStatus = useOperationsStore((state) => state.changePostStatus);
  const filtered = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase('vi');
    return posts.filter(
      (post) =>
        (status === 'ALL' || post.status === status) &&
        (!keyword || post.title.toLocaleLowerCase('vi').includes(keyword)),
    );
  }, [posts, search, status]);

  return (
    <>
      <WorkspacePageHeading
        actions={
          <Link className="btn btn-primary" to="/partner/posts/new">
            <Plus size={18} /> Tạo bài đăng
          </Link>
        }
        description="Tạo, chỉnh sửa và theo dõi toàn bộ vòng đời nội dung của tổ chức."
        title="Quản lý bài đăng"
      />
      <section className="workspace-panel">
        <div className="workspace-toolbar">
          <label className="input-shell workspace-toolbar-search">
            <Search size={17} />
            <input
              aria-label="Tìm bài đăng"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo tiêu đề..."
              value={search}
            />
          </label>
          <label className="workspace-select-label">
            <span>Trạng thái</span>
            <select
              className="field-control"
              onChange={(event) => setStatus(event.target.value as 'ALL' | OpportunityStatus)}
              value={status}
            >
              {postFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <span className="workspace-result-count">{filtered.length} bài đăng</span>
        </div>
        {filtered.length ? (
          <div className="workspace-table-wrap">
            <table className="workspace-table workspace-action-table">
              <thead>
                <tr>
                  <th>Cơ hội</th>
                  <th>Danh mục</th>
                  <th>Hạn đăng ký</th>
                  <th>Trạng thái</th>
                  <th>Hiệu quả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <strong>{post.title}</strong>
                      <small>Cập nhật {new Date(post.updatedAt).toLocaleString('vi-VN')}</small>
                      {post.reviewerNote ? (
                        <span className="workspace-inline-note">{post.reviewerNote}</span>
                      ) : null}
                    </td>
                    <td>{CATEGORY_LABELS[post.category]}</td>
                    <td>{new Date(post.deadline).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <StatusBadge status={post.status} />
                    </td>
                    <td>
                      <span className="workspace-kpi-inline">
                        <Eye size={15} /> {post.views} · {post.applications} đăng ký
                      </span>
                    </td>
                    <td>
                      <div className="workspace-row-actions">
                        <Link
                          aria-label={`Sửa ${post.title}`}
                          className="workspace-icon-action"
                          to={`/partner/posts/${post.id}/edit`}
                        >
                          <Edit3 size={17} />
                        </Link>
                        {post.status === 'DRAFT' || post.status === 'REVISION_REQUIRED' ? (
                          <Button
                            aria-label={`Gửi duyệt ${post.title}`}
                            onClick={() => changePostStatus(post.id, 'PENDING_REVIEW')}
                            variant="ghost"
                          >
                            <Send size={16} />
                          </Button>
                        ) : null}
                        {post.status === 'OPEN' ? (
                          <Button
                            aria-label={`Yêu cầu đóng ${post.title}`}
                            onClick={() =>
                              changePostStatus(post.id, 'CLOSED', 'Đối tác đã yêu cầu đóng bài.')
                            }
                            variant="danger"
                          >
                            <XCircle size={16} />
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyTableState
            title="Không tìm thấy bài đăng"
            description="Thử thay đổi từ khóa hoặc bộ lọc trạng thái."
          />
        )}
      </section>
    </>
  );
}
