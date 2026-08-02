import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, FileText, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { formatFileSize } from '@/lib/format';
import { submitOpportunityApplication } from '@/mocks/services/applicationService';
import type { Opportunity } from '@/shared/types/opportunity';
import { useStudentStore } from '@/stores/studentStore';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ['.pdf', '.docx'];

const applicationSchema = z.object({
  fullName: z.string().trim().min(2, 'Vui lòng nhập họ và tên.'),
  email: z.email('Email chưa đúng định dạng.'),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)\d{9,10}$/, 'Số điện thoại chưa hợp lệ.'),
  university: z.string().trim().min(2, 'Vui lòng nhập trường đang học.'),
  major: z.string().trim().min(2, 'Vui lòng nhập chuyên ngành.'),
  cvFile: z
    .custom<FileList>((value) => value instanceof FileList && value.length === 1, {
      message: 'Vui lòng tải lên CV.',
    })
    .refine(
      (files) => ACCEPTED_EXTENSIONS.some((ext) => files[0]?.name.toLowerCase().endsWith(ext)),
      'Chỉ chấp nhận file PDF hoặc DOCX.',
    )
    .refine((files) => (files[0]?.size ?? 0) <= MAX_FILE_SIZE, 'Dung lượng file tối đa 5MB.'),
});
type ApplicationValues = z.infer<typeof applicationSchema>;

interface ApplyOpportunityDialogProps {
  opportunity: Opportunity;
  onClose: () => void;
}

export function ApplyOpportunityDialog({ opportunity, onClose }: ApplyOpportunityDialogProps) {
  const profile = useStudentStore((state) => state.profile);
  const addApplication = useStudentStore((state) => state.submitApplication);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: profile.fullName,
      email: profile.email,
      phone: '',
      university: profile.university,
      major: profile.major,
    },
  });
  const cvFile = watch('cvFile')?.[0];

  const submit = async (values: ApplicationValues) => {
    setSubmitError('');
    const file = values.cvFile[0];
    if (!file) return;
    try {
      const application = await submitOpportunityApplication({
        opportunityId: opportunity.id,
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        university: values.university.trim(),
        major: values.major.trim(),
        cvFile: file,
      });
      addApplication(application);
      setSubmitted(true);
    } catch {
      setSubmitError('Gửi hồ sơ thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div aria-labelledby="apply-title" aria-modal="true" className="dialog-wrap" role="dialog">
      <button
        aria-label="Đóng hộp thoại"
        className="dialog-backdrop"
        onClick={onClose}
        type="button"
      />
      <div className="dialog-card dialog-card-form">
        {submitted ? (
          <div className="success-panel">
            <CheckCircle2 color="#118a5b" size={30} />
            <h2>Đăng ký thành công</h2>
            <p>
              Hồ sơ của bạn đã được gửi tới {opportunity.organization.name}. Theo dõi email để
              nhận phản hồi tiếp theo.
            </p>
            <Button className="w-full" onClick={onClose}>
              Đóng
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="apply-title">Đăng ký ứng tuyển</h2>
                <p className="dialog-subtitle">{opportunity.title}</p>
              </div>
              <button
                aria-label="Đóng"
                className="save-button"
                onClick={onClose}
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            <form className="apply-form" noValidate onSubmit={handleSubmit(submit)}>
              <div className="form-grid">
                <label className="field-label" htmlFor="apply-fullName">
                  Họ và tên
                  <input className="field-control" id="apply-fullName" {...register('fullName')} />
                  {errors.fullName ? (
                    <span className="field-error">{errors.fullName.message}</span>
                  ) : null}
                </label>
                <label className="field-label" htmlFor="apply-email">
                  Email
                  <input
                    className="field-control"
                    id="apply-email"
                    type="email"
                    {...register('email')}
                  />
                  {errors.email ? <span className="field-error">{errors.email.message}</span> : null}
                </label>
                <label className="field-label" htmlFor="apply-phone">
                  Số điện thoại
                  <input
                    className="field-control"
                    id="apply-phone"
                    placeholder="0901234567"
                    {...register('phone')}
                  />
                  {errors.phone ? <span className="field-error">{errors.phone.message}</span> : null}
                </label>
                <label className="field-label" htmlFor="apply-university">
                  Trường đang học
                  <input
                    className="field-control"
                    id="apply-university"
                    {...register('university')}
                  />
                  {errors.university ? (
                    <span className="field-error">{errors.university.message}</span>
                  ) : null}
                </label>
                <label className="field-label" htmlFor="apply-major">
                  Chuyên ngành
                  <input className="field-control" id="apply-major" {...register('major')} />
                  {errors.major ? <span className="field-error">{errors.major.message}</span> : null}
                </label>
              </div>
              <label className="field-label" htmlFor="apply-cv">
                File CV (PDF hoặc DOCX, tối đa 5MB)
                <input
                  accept=".pdf,.docx"
                  className="field-control"
                  id="apply-cv"
                  type="file"
                  {...register('cvFile')}
                />
                {cvFile ? (
                  <span className="file-chip">
                    <FileText size={14} /> {cvFile.name} · {formatFileSize(cvFile.size)}
                  </span>
                ) : null}
                {errors.cvFile ? (
                  <span className="field-error">{String(errors.cvFile.message)}</span>
                ) : null}
              </label>
              {submitError ? (
                <div className="auth-error" role="alert">
                  {submitError}
                </div>
              ) : null}
              <div className="apply-form-actions">
                <Button onClick={onClose} type="button" variant="secondary">
                  Hủy
                </Button>
                <Button isLoading={isSubmitting} type="submit">
                  Gửi đăng ký
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
