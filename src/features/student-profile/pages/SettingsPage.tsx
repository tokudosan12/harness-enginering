import { Bell, CalendarClock, Mail, Save, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '@/shared/constants/opportunities';
import { useStudentStore } from '@/stores/studentStore';

function SettingSwitch({
  checked,
  onChange,
  label,
  description,
  icon,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="setting-row">
      <span className="setting-icon">{icon}</span>
      <div>
        <strong>{label}</strong>
        <p>{description}</p>
      </div>
      <button
        aria-label={`${checked ? 'Tắt' : 'Bật'} ${label}`}
        aria-pressed={checked}
        className={`switch ${checked ? 'switch-on' : ''}`}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const current = useStudentStore((state) => state.settings);
  const update = useStudentStore((state) => state.updateSettings);
  const [settings, setSettings] = useState(current);
  const [saved, setSaved] = useState(false);
  const toggleCategory = (value: string) =>
    setSettings((state) => ({
      ...state,
      categories: state.categories.includes(value)
        ? state.categories.filter((item) => item !== value)
        : [...state.categories, value],
    }));
  const save = () => {
    update(settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };
  return (
    <div>
      <div className="dashboard-heading">
        <div>
          <h1>Cài đặt thông báo</h1>
          <p>Bạn luôn có thể tắt những thông báo không bắt buộc.</p>
        </div>
        {saved ? <span className="save-success">Đã lưu cài đặt</span> : null}
      </div>
      <div className="settings-panel">
        <SettingSwitch
          checked={settings.inApp}
          description="Hiển thị thông báo mới trong Student Opportunity Hub."
          icon={<Bell />}
          label="Thông báo trong hệ thống"
          onChange={(value) => setSettings({ ...settings, inApp: value })}
        />
        <SettingSwitch
          checked={settings.reminders}
          description="Nhắc trước khi cơ hội đã lưu hết hạn."
          icon={<CalendarClock />}
          label="Nhắc hạn đăng ký"
          onChange={(value) => setSettings({ ...settings, reminders: value })}
        />
        {settings.reminders ? (
          <label className="setting-subfield">
            Nhắc trước hạn
            <select
              className="field-control"
              onChange={(event) =>
                setSettings({ ...settings, reminderDays: Number(event.target.value) })
              }
              value={settings.reminderDays}
            >
              <option value={1}>1 ngày</option>
              <option value={3}>3 ngày</option>
              <option value={7}>7 ngày</option>
            </select>
          </label>
        ) : null}
        <SettingSwitch
          checked={settings.newMatches}
          description="Nhận gợi ý khi có cơ hội mới phù hợp với sở thích."
          icon={<Sparkles />}
          label="Cơ hội mới phù hợp"
          onChange={(value) => setSettings({ ...settings, newMatches: value })}
        />
        <fieldset className="choice-fieldset px-0">
          <legend>Nhóm cơ hội muốn nhận</legend>
          <div className="choice-grid">
            {ALL_CATEGORIES.map((value) => (
              <label key={value}>
                <input
                  checked={settings.categories.includes(value)}
                  onChange={() => toggleCategory(value)}
                  type="checkbox"
                />
                {CATEGORY_LABELS[value]}
              </label>
            ))}
          </div>
        </fieldset>
        <SettingSwitch
          checked={settings.marketingEmail}
          description="Email về tin tức sản phẩm và nội dung tuyển chọn; không bắt buộc."
          icon={<Mail />}
          label="Email giới thiệu và marketing"
          onChange={(value) => setSettings({ ...settings, marketingEmail: value })}
        />
        <div className="flex justify-end pt-5">
          <Button onClick={save}>
            <Save size={17} /> Lưu cài đặt
          </Button>
        </div>
      </div>
    </div>
  );
}
