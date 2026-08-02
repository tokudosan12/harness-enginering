import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { StatusBadge, WorkspacePageHeading } from '@/components/workspace/WorkspaceUI';
import { CATEGORY_LABELS, MODE_LABELS } from '@/shared/constants/opportunities';
import type { OpportunityStatus } from '@/shared/types/opportunity';
import { useOperationsStore } from '@/stores/operationsStore';

export function ModerationReviewPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = useOperationsStore((state) => state.posts.find((item) => item.id === postId));
  const changePostStatus = useOperationsStore((state) => state.changePostStatus);
  const [note, setNote] = useState(post?.reviewerNote ?? '');
  const [error, setError] = useState('');

  if (!post) {
    return (
      <div className="workspace-panel workspace-empty-row">
        <strong>Không tìm thấy nội dung</strong>
        <Link to="/moderator/review-queue">Quay lại hàng chờ</Link>
      </div>
    );
  }

  const decide = (status: OpportunityStatus) => {
    if (status !== 'OPEN' && note.trim().length < 12) {
      setError('Vui lòng nhập lý do tối thiểu 12 ký tự cho quyết định này.');
      return;
    }
    changePostStatus(post.id, status, note.trim() || 'Nội dung đáp ứng tiêu chuẩn công khai.');
    navigate('/moderator/review-queue');
  };

  return (
    <>
      <WorkspacePageHeading
        actions={
          <Link className="btn btn-ghost" to="/moderator/review-queue">
            <ArrowLeft size={18} /> Hàng chờ
          </Link>
        }
        description="Đối chiếu nguồn, tính đầy đủ, hạn đăng ký và tiêu chuẩn nội dung trước khi quyết định."
        title="Chi tiết kiểm duyệt"
      />
      <div className="workspace-review-layout">
        <article className="workspace-panel workspace-review-document">
          <div className="workspace-review-document-head">
            <div>
              <span>{CATEGORY_LABELS[post.category]}</span>
              <h1>{post.title}</h1>
              <p>{post.summary}</p>
            </div>
            <StatusBadge status={post.status} />
          </div>
          <dl className="workspace-metadata-grid">
            <div>
              <dt>Tổ chức</dt>
              <dd>Future Skills Vietnam</dd>
            </div>
            <div>
              <dt>Hình thức</dt>
              <dd>{MODE_LABELS[post.mode]}</dd>
            </div>
            <div>
              <dt>Địa điểm</dt>
              <dd>{post.location}</dd>
            </div>
            <div>
              <dt>Hạn đăng ký</dt>
              <dd>{new Date(post.deadline).toLocaleDateString('vi-VN')}</dd>
            </div>
          </dl>
          <section>
            <h2>Nội dung chi tiết</h2>
            <p>{post.description}</p>
          </section>
          <section>
            <h2>Nguồn và liên hệ</h2>
            <a
              className="workspace-source-link"
              href="https://futureskills.example.com"
              rel="noreferrer"
              target="_blank"
            >
              futureskills.example.com <ExternalLink size={15} />
            </a>
          </section>
        </article>
        <aside className="workspace-review-aside">
          <section className="workspace-panel workspace-duplicate-card">
            <div>
              <AlertTriangle size={20} />
              <h2>Cảnh báo trùng lặp</h2>
            </div>
            <p>Hệ thống tìm thấy một nội dung có độ tương đồng 72%.</p>
            <button type="button">“Future Founders Challenge 2026”</button>
          </section>
          <section className="workspace-panel workspace-decision-card">
            <h2>Quyết định kiểm duyệt</h2>
            <label className="field-label">
              Ghi chú cho đối tác
              <textarea
                className="field-control workspace-textarea-sm"
                onChange={(event) => setNote(event.target.value)}
                placeholder="Nêu rõ lý do hoặc nội dung cần bổ sung..."
                value={note}
              />
            </label>
            {error ? (
              <div className="auth-error" role="alert">
                {error}
              </div>
            ) : null}
            <div className="workspace-decision-actions">
              <Button onClick={() => decide('OPEN')}>
                <CheckCircle2 size={17} /> Phê duyệt & công khai
              </Button>
              <Button onClick={() => decide('REVISION_REQUIRED')} variant="secondary">
                <RotateCcw size={17} /> Yêu cầu chỉnh sửa
              </Button>
              <Button onClick={() => decide('HIDDEN')} variant="danger">
                <XCircle size={17} /> Từ chối nội dung
              </Button>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
