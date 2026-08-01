import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/features/authentication/components/AuthShell';
import {
  ALL_CATEGORIES,
  ALL_MODES,
  CATEGORY_LABELS,
  MODE_LABELS,
} from '@/shared/constants/opportunities';
import { useStudentStore } from '@/stores/studentStore';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ và tên.'),
  email: z.email(),
  university: z.string().min(2, 'Vui lòng nhập trường.'),
  major: z.string().min(2, 'Vui lòng nhập chuyên ngành.'),
  studyYear: z.string(),
  city: z.string(),
  bio: z.string().max(300, 'Giới thiệu tối đa 300 ký tự.'),
  interestedCategories: z.array(z.string()),
  interestedFields: z.array(z.string()),
  interestedSkills: z.array(z.string()),
  preferredLocations: z.array(z.string()),
  preferredModes: z.array(z.string()),
});
type ProfileValues = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const profile = useStudentStore((state) => state.profile);
  const updateProfile = useStudentStore((state) => state.updateProfile);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: profile });
  const submit = async (values: ProfileValues) => {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 450));
    updateProfile(values);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div>
      <div className="dashboard-heading">
        <div>
          <h1>Hồ sơ và sở thích</h1>
          <p>Thông tin này được dùng để tạo gợi ý cơ bản trong bản demo.</p>
        </div>
        {saved ? <span className="save-success">Đã lưu thay đổi</span> : null}
      </div>
      <form className="profile-form" onSubmit={handleSubmit(submit)} noValidate>
        <section>
          <h2>Thông tin cá nhân</h2>
          <div className="form-grid">
            <FormField error={errors.fullName?.message} htmlFor="fullName" label="Họ và tên">
              <input className="field-control" id="fullName" {...register('fullName')} />
            </FormField>
            <FormField error={errors.email?.message} htmlFor="email" label="Email">
              <input className="field-control" id="email" readOnly {...register('email')} />
            </FormField>
            <FormField error={errors.university?.message} htmlFor="university" label="Trường">
              <input className="field-control" id="university" {...register('university')} />
            </FormField>
            <FormField error={errors.major?.message} htmlFor="major" label="Chuyên ngành">
              <input className="field-control" id="major" {...register('major')} />
            </FormField>
            <FormField htmlFor="studyYear" label="Năm học">
              <select className="field-control" id="studyYear" {...register('studyYear')}>
                <option>Năm 1</option>
                <option>Năm 2</option>
                <option>Năm 3</option>
                <option>Năm 4</option>
                <option>Khác</option>
              </select>
            </FormField>
            <FormField htmlFor="city" label="Thành phố">
              <input className="field-control" id="city" {...register('city')} />
            </FormField>
          </div>
          <FormField error={errors.bio?.message} htmlFor="bio" label="Giới thiệu ngắn">
            <textarea
              className="field-control mt-1 min-h-28 resize-y"
              id="bio"
              {...register('bio')}
            />
          </FormField>
        </section>
        <section>
          <h2>Sở thích cơ hội</h2>
          <fieldset className="choice-fieldset">
            <legend>Loại cơ hội quan tâm</legend>
            <div className="choice-grid">
              {ALL_CATEGORIES.map((value) => (
                <label key={value}>
                  <input type="checkbox" value={value} {...register('interestedCategories')} />
                  {CATEGORY_LABELS[value]}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="choice-fieldset">
            <legend>Hình thức mong muốn</legend>
            <div className="choice-grid">
              {ALL_MODES.map((value) => (
                <label key={value}>
                  <input type="checkbox" value={value} {...register('preferredModes')} />
                  {MODE_LABELS[value]}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="form-grid">
            <FormField htmlFor="fields" label="Lĩnh vực quan tâm (phân cách bằng dấu phẩy)">
              <input className="field-control" id="fields" {...register('interestedFields.0')} />
            </FormField>
            <FormField htmlFor="skills" label="Kỹ năng quan tâm (phân cách bằng dấu phẩy)">
              <input className="field-control" id="skills" {...register('interestedSkills.0')} />
            </FormField>
            <FormField htmlFor="locations" label="Địa điểm quan tâm">
              <input
                className="field-control"
                id="locations"
                {...register('preferredLocations.0')}
              />
            </FormField>
          </div>
        </section>
        <div className="flex justify-end">
          <Button isLoading={isSubmitting} type="submit">
            <Save size={17} /> Lưu hồ sơ
          </Button>
        </div>
      </form>
    </div>
  );
}
