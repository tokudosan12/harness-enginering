import { Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { WorkspacePageHeading } from '@/components/workspace/WorkspaceUI';

export function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    autoExpire: true,
    requireVerifiedPartner: true,
    duplicateDetection: true,
    reviewSla: '24',
    maxReports: '3',
  });
  const toggle = (key: 'autoExpire' | 'requireVerifiedPartner' | 'duplicateDetection') =>
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  return (
    <>
      <WorkspacePageHeading
        description="Thiết lập quy tắc vòng đời nội dung và tiêu chuẩn kiểm duyệt mặc định."
        title="Cấu hình hệ thống"
      />
      <form
        className="workspace-panel workspace-settings-form"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
          window.setTimeout(() => setSaved(false), 2500);
        }}
      >
        <section>
          <h2>Quy tắc nội dung</h2>
          <label className="workspace-setting-row">
            <div>
              <strong>Tự động hết hạn bài đăng</strong>
              <span>Chuyển bài sang EXPIRED khi qua hạn đăng ký.</span>
            </div>
            <input
              checked={settings.autoExpire}
              onChange={() => toggle('autoExpire')}
              type="checkbox"
            />
          </label>
          <label className="workspace-setting-row">
            <div>
              <strong>Yêu cầu đối tác đã xác minh</strong>
              <span>Chỉ tổ chức đã xác minh mới được gửi bài kiểm duyệt.</span>
            </div>
            <input
              checked={settings.requireVerifiedPartner}
              onChange={() => toggle('requireVerifiedPartner')}
              type="checkbox"
            />
          </label>
          <label className="workspace-setting-row">
            <div>
              <strong>Phát hiện nội dung trùng</strong>
              <span>Hiển thị cảnh báo tương đồng trong màn hình kiểm duyệt.</span>
            </div>
            <input
              checked={settings.duplicateDetection}
              onChange={() => toggle('duplicateDetection')}
              type="checkbox"
            />
          </label>
        </section>
        <section>
          <h2>Ngưỡng vận hành</h2>
          <div className="workspace-form-row">
            <label className="field-label">
              SLA kiểm duyệt (giờ)
              <input
                className="field-control"
                min="1"
                onChange={(event) =>
                  setSettings((current) => ({ ...current, reviewSla: event.target.value }))
                }
                type="number"
                value={settings.reviewSla}
              />
            </label>
            <label className="field-label">
              Số report trước khi cảnh báo
              <input
                className="field-control"
                min="1"
                onChange={(event) =>
                  setSettings((current) => ({ ...current, maxReports: event.target.value }))
                }
                type="number"
                value={settings.maxReports}
              />
            </label>
          </div>
        </section>
        <div className="workspace-editor-actions">
          <span className="workspace-save-message" role="status">
            {saved ? 'Đã lưu cấu hình.' : ''}
          </span>
          <Button type="submit">
            <Save size={17} /> Lưu cấu hình
          </Button>
        </div>
      </form>
    </>
  );
}
