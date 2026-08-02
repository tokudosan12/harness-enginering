import { ArrowLeft, Eye, Save, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { StatusBadge, WorkspacePageHeading } from '@/components/workspace/WorkspaceUI';
import { CATEGORY_LABELS, MODE_LABELS } from '@/shared/constants/opportunities';
import type { PartnerPostInput } from '@/shared/types/operations';
import type { OpportunityCategory, ParticipationMode } from '@/shared/types/opportunity';
import { useOperationsStore } from '@/stores/operationsStore';

const blankPost: PartnerPostInput = {
  title: '',
  summary: '',
  description: '',
  category: 'INTERNSHIP',
  mode: 'HYBRID',
  location: '',
  deadline: '',
};

export function PartnerPostEditorPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const existing = useOperationsStore((state) => state.posts.find((post) => post.id === postId));
  const savePost = useOperationsStore((state) => state.savePost);
  const [form, setForm] = useState<PartnerPostInput>(() =>
    existing
      ? {
          title: existing.title,
          summary: existing.summary,
          description: existing.description,
          category: existing.category,
          mode: existing.mode,
          location: existing.location,
          deadline: existing.deadline,
        }
      : blankPost,
  );
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(existing);
  const title = isEditing ? 'Chỉnh sửa cơ hội' : 'Tạo cơ hội mới';
  const canSubmit = useMemo(
    () =>
      form.title.trim().length >= 8 &&
      form.summary.trim().length >= 20 &&
      form.description.trim().length >= 40 &&
      Boolean(form.deadline),
    [form],
  );

  const update = <K extends keyof PartnerPostInput>(key: K, value: PartnerPostInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const save = (submit: boolean) => {
    if (submit && !canSubmit) {
      setError('Vui lòng hoàn thiện tiêu đề, tóm tắt, mô tả và hạn đăng ký trước khi gửi duyệt.');
      return;
    }
    setError('');
    savePost(form, existing?.id, submit);
    navigate('/partner/posts');
  };

  return (
    <>
      <WorkspacePageHeading
        actions={
          <Link className="btn btn-ghost" to="/partner/posts">
            <ArrowLeft size={18} /> Quay lại
          </Link>
        }
        description="Thông tin rõ ràng giúp kiểm duyệt nhanh hơn và tăng tỷ lệ đăng ký."
        title={title}
      />
      {existing?.status === 'REVISION_REQUIRED' && existing.reviewerNote ? (
        <div className="workspace-review-note">
          <strong>Yêu cầu từ kiểm duyệt viên</strong>
          <p>{existing.reviewerNote}</p>
        </div>
      ) : null}
      <div className="workspace-editor-grid">
        <form
          className="workspace-panel workspace-form-panel"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="workspace-form-section">
            <span>01</span>
            <div>
              <h2>Thông tin chính</h2>
              <p>Tiêu đề và mô tả ngắn xuất hiện trên bảng tin.</p>
            </div>
          </div>
          <label className="field-label">
            Tiêu đề cơ hội *
            <input
              className="field-control"
              maxLength={120}
              onChange={(event) => update('title', event.target.value)}
              placeholder="Ví dụ: Thực tập Data Analyst 2026"
              value={form.title}
            />
          </label>
          <label className="field-label">
            Tóm tắt *
            <textarea
              className="field-control workspace-textarea-sm"
              maxLength={240}
              onChange={(event) => update('summary', event.target.value)}
              placeholder="Nêu điểm nổi bật trong 1–2 câu"
              value={form.summary}
            />
            <small>{form.summary.length}/240 ký tự</small>
          </label>
          <div className="workspace-form-row">
            <label className="field-label">
              Danh mục
              <select
                className="field-control"
                onChange={(event) => update('category', event.target.value as OpportunityCategory)}
                value={form.category}
              >
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label">
              Hình thức
              <select
                className="field-control"
                onChange={(event) => update('mode', event.target.value as ParticipationMode)}
                value={form.mode}
              >
                {Object.entries(MODE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="workspace-form-row">
            <label className="field-label">
              Địa điểm
              <input
                className="field-control"
                onChange={(event) => update('location', event.target.value)}
                placeholder="TP. Hồ Chí Minh hoặc Toàn quốc"
                value={form.location}
              />
            </label>
            <label className="field-label">
              Hạn đăng ký *
              <input
                className="field-control"
                min="2026-08-02"
                onChange={(event) => update('deadline', event.target.value)}
                type="date"
                value={form.deadline}
              />
            </label>
          </div>
          <div className="workspace-form-section">
            <span>02</span>
            <div>
              <h2>Nội dung chi tiết</h2>
              <p>Mô tả công việc, đối tượng, quyền lợi và cách tham gia.</p>
            </div>
          </div>
          <label className="field-label">
            Mô tả đầy đủ *
            <textarea
              className="field-control workspace-textarea-lg"
              onChange={(event) => update('description', event.target.value)}
              placeholder="Trình bày mục tiêu, hoạt động, yêu cầu và quyền lợi..."
              value={form.description}
            />
          </label>
          {error ? (
            <div className="auth-error" role="alert">
              {error}
            </div>
          ) : null}
          <div className="workspace-editor-actions">
            <Button onClick={() => setPreview((value) => !value)} type="button" variant="secondary">
              <Eye size={17} /> {preview ? 'Ẩn xem trước' : 'Xem trước'}
            </Button>
            <Button onClick={() => save(false)} type="button" variant="ghost">
              <Save size={17} /> Lưu bản nháp
            </Button>
            <Button onClick={() => save(true)} type="button">
              <Send size={17} /> Gửi kiểm duyệt
            </Button>
          </div>
        </form>
        <aside className="workspace-preview-column">
          <div className="workspace-panel workspace-checklist">
            <h2>Trước khi gửi</h2>
            <ul>
              <li className={form.title.length >= 8 ? 'is-complete' : ''}>
                Tiêu đề cụ thể, dễ hiểu
              </li>
              <li className={form.summary.length >= 20 ? 'is-complete' : ''}>
                Tóm tắt tối thiểu 20 ký tự
              </li>
              <li className={form.description.length >= 40 ? 'is-complete' : ''}>
                Mô tả đầy đủ nội dung
              </li>
              <li className={form.deadline ? 'is-complete' : ''}>Có hạn đăng ký hợp lệ</li>
            </ul>
            {existing ? <StatusBadge status={existing.status} /> : null}
          </div>
          {preview ? (
            <article className="workspace-panel workspace-post-preview">
              <span>{CATEGORY_LABELS[form.category]}</span>
              <h2>{form.title || 'Tiêu đề cơ hội'}</h2>
              <p>{form.summary || 'Nội dung tóm tắt sẽ xuất hiện tại đây.'}</p>
              <dl>
                <div>
                  <dt>Hình thức</dt>
                  <dd>{MODE_LABELS[form.mode]}</dd>
                </div>
                <div>
                  <dt>Địa điểm</dt>
                  <dd>{form.location || 'Chưa cập nhật'}</dd>
                </div>
                <div>
                  <dt>Hạn đăng ký</dt>
                  <dd>
                    {form.deadline
                      ? new Date(form.deadline).toLocaleDateString('vi-VN')
                      : 'Chưa cập nhật'}
                  </dd>
                </div>
              </dl>
            </article>
          ) : null}
        </aside>
      </div>
    </>
  );
}
