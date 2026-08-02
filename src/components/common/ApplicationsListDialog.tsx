import { ArrowLeft, CheckCircle2, FileText, X, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/date';
import { formatFileSize } from '@/lib/format';
import type { PartnerPost } from '@/shared/types/operations';
import type { ApplicationStatus } from '@/shared/types/opportunity';
import { useStudentStore } from '@/stores/studentStore';

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: 'Chờ xử lý',
  SHORTLISTED: 'Đã duyệt',
  REJECTED: 'Từ chối',
};

function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`workspace-status workspace-status-${status.toLowerCase()}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

interface ApplicationsListDialogProps {
  post: PartnerPost;
  onClose: () => void;
}

export function ApplicationsListDialog({ post, onClose }: ApplicationsListDialogProps) {
  const applications = useStudentStore((state) => state.applications);
  const updateApplicationStatus = useStudentStore((state) => state.updateApplicationStatus);
  const list = useMemo(
    () => applications.filter((item) => item.opportunityId === post.id),
    [applications, post.id],
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailId, setDetailId] = useState<string | null>(null);
  const allSelected = list.length > 0 && selectedIds.length === list.length;
  const detail = list.find((item) => item.id === detailId);

  const toggleAll = () => setSelectedIds(allSelected ? [] : list.map((item) => item.id));
  const toggleOne = (id: string) =>
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  const bulkUpdate = (status: ApplicationStatus) => {
    updateApplicationStatus(selectedIds, status);
    setSelectedIds([]);
  };

  return (
    <div
      aria-labelledby="applications-title"
      aria-modal="true"
      className="dialog-wrap"
      role="dialog"
    >
      <button
        aria-label="Đóng hộp thoại"
        className="dialog-backdrop"
        onClick={onClose}
        type="button"
      />
      <div className="dialog-card dialog-card-form">
        {detail ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <button
                className="dialog-back-link"
                onClick={() => setDetailId(null)}
                type="button"
              >
                <ArrowLeft size={16} /> Quay lại danh sách
              </button>
              <button aria-label="Đóng" className="save-button" onClick={onClose} type="button">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <h2 id="applications-title">{detail.fullName}</h2>
              <ApplicationStatusBadge status={detail.status} />
            </div>
            <dl className="detail-facts mt-2">
              <div>
                <dt>Email</dt>
                <dd>{detail.email}</dd>
              </div>
              <div>
                <dt>Số điện thoại</dt>
                <dd>{detail.phone}</dd>
              </div>
              <div>
                <dt>Trường</dt>
                <dd>{detail.university}</dd>
              </div>
              <div>
                <dt>Chuyên ngành</dt>
                <dd>{detail.major}</dd>
              </div>
              <div>
                <dt>Ngày nộp</dt>
                <dd>{formatDate(detail.submittedAt)}</dd>
              </div>
            </dl>
            <span className="file-chip mt-3">
              <FileText size={14} /> {detail.cvFileName} · {formatFileSize(detail.cvFileSize)}
            </span>
            <div className="apply-form-actions mt-6">
              <Button
                onClick={() => updateApplicationStatus([detail.id], 'REJECTED')}
                type="button"
                variant="danger"
              >
                <XCircle size={16} /> Từ chối
              </Button>
              <Button
                onClick={() => updateApplicationStatus([detail.id], 'SHORTLISTED')}
                type="button"
              >
                <CheckCircle2 size={16} /> Duyệt hồ sơ
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="applications-title">Đơn đăng ký</h2>
                <p className="dialog-subtitle">
                  {post.title} · {list.length} đơn
                </p>
              </div>
              <button aria-label="Đóng" className="save-button" onClick={onClose} type="button">
                <X size={18} />
              </button>
            </div>
            {list.length === 0 ? (
              <div className="workspace-empty-row mt-6">
                <strong>Chưa có đơn đăng ký</strong>
                <span>Hồ sơ sinh viên nộp cho cơ hội này sẽ xuất hiện tại đây.</span>
              </div>
            ) : (
              <>
                <div className="applications-toolbar">
                  <label className="applications-select-all">
                    <input checked={allSelected} onChange={toggleAll} type="checkbox" />
                    Chọn tất cả ({selectedIds.length}/{list.length})
                  </label>
                  <div className="apply-form-actions">
                    <Button
                      disabled={selectedIds.length === 0}
                      onClick={() => bulkUpdate('REJECTED')}
                      type="button"
                      variant="danger"
                    >
                      <XCircle size={16} /> Từ chối đã chọn
                    </Button>
                    <Button
                      disabled={selectedIds.length === 0}
                      onClick={() => bulkUpdate('SHORTLISTED')}
                      type="button"
                    >
                      <CheckCircle2 size={16} /> Duyệt đã chọn
                    </Button>
                  </div>
                </div>
                <ul className="applications-list">
                  {list.map((item) => (
                    <li className="applications-list-row" key={item.id}>
                      <input
                        aria-label={`Chọn đơn của ${item.fullName}`}
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleOne(item.id)}
                        type="checkbox"
                      />
                      <button
                        className="applications-list-row-main"
                        onClick={() => setDetailId(item.id)}
                        type="button"
                      >
                        <span className="applications-list-name">{item.fullName}</span>
                        <span className="applications-list-meta">
                          {item.university} · Nộp {formatDate(item.submittedAt)}
                        </span>
                      </button>
                      <ApplicationStatusBadge status={item.status} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
