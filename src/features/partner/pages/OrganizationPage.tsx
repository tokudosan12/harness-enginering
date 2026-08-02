import { BadgeCheck, Building2, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { WorkspacePageHeading } from '@/components/workspace/WorkspaceUI';
import type { OrganizationProfile } from '@/shared/types/operations';
import { useOperationsStore } from '@/stores/operationsStore';

export function OrganizationPage() {
  const organization = useOperationsStore((state) => state.organization);
  const updateOrganization = useOperationsStore((state) => state.updateOrganization);
  const [form, setForm] = useState<OrganizationProfile>(organization);
  const [saved, setSaved] = useState(false);
  const update = <K extends keyof OrganizationProfile>(key: K, value: OrganizationProfile[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const save = () => {
    updateOrganization(form);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <WorkspacePageHeading
        description="Thông tin được hiển thị trên các bài đăng và dùng để xác minh nguồn."
        title="Hồ sơ tổ chức"
      />
      <div className="workspace-profile-grid">
        <aside className="workspace-panel workspace-organization-card">
          <div className="workspace-organization-logo">
            <Building2 size={36} />
          </div>
          <h2>{form.name}</h2>
          {form.verified ? (
            <span>
              <BadgeCheck size={17} /> Đã xác minh
            </span>
          ) : null}
          <p>{form.description}</p>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{form.email}</dd>
            </div>
            <div>
              <dt>Website</dt>
              <dd>{form.website}</dd>
            </div>
            <div>
              <dt>Địa chỉ</dt>
              <dd>{form.address}</dd>
            </div>
          </dl>
        </aside>
        <form
          className="workspace-panel workspace-form-panel"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <div className="workspace-form-section">
            <span>01</span>
            <div>
              <h2>Thông tin pháp lý & liên hệ</h2>
              <p>Dữ liệu này giúp sinh viên nhận diện nguồn chính thức.</p>
            </div>
          </div>
          <div className="workspace-form-row">
            <label className="field-label">
              Tên tổ chức
              <input
                className="field-control"
                onChange={(event) => update('name', event.target.value)}
                value={form.name}
              />
            </label>
            <label className="field-label">
              Website
              <input
                className="field-control"
                onChange={(event) => update('website', event.target.value)}
                value={form.website}
              />
            </label>
          </div>
          <div className="workspace-form-row">
            <label className="field-label">
              Email liên hệ
              <input
                className="field-control"
                onChange={(event) => update('email', event.target.value)}
                type="email"
                value={form.email}
              />
            </label>
            <label className="field-label">
              Số điện thoại
              <input
                className="field-control"
                onChange={(event) => update('phone', event.target.value)}
                value={form.phone}
              />
            </label>
          </div>
          <label className="field-label">
            Địa chỉ
            <input
              className="field-control"
              onChange={(event) => update('address', event.target.value)}
              value={form.address}
            />
          </label>
          <label className="field-label">
            Giới thiệu
            <textarea
              className="field-control workspace-textarea-lg"
              onChange={(event) => update('description', event.target.value)}
              value={form.description}
            />
          </label>
          <div className="workspace-editor-actions">
            <span className="workspace-save-message" role="status">
              {saved ? 'Đã lưu thay đổi.' : ''}
            </span>
            <Button type="submit">
              <Save size={17} /> Lưu hồ sơ
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
