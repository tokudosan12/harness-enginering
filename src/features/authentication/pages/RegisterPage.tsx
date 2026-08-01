import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { AuthShell, FormField } from '@/features/authentication/components/AuthShell';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Vui lòng nhập họ và tên.'),
    email: z.email('Email chưa đúng định dạng.'),
    password: z
      .string()
      .min(8, 'Mật khẩu cần ít nhất 8 ký tự.')
      .regex(/[A-Z]/, 'Cần ít nhất một chữ hoa.')
      .regex(/[0-9]/, 'Cần ít nhất một chữ số.'),
    confirmPassword: z.string(),
    university: z.string().min(2, 'Vui lòng nhập trường.'),
    major: z.string().min(2, 'Vui lòng nhập chuyên ngành.'),
    studyYear: z.string().min(1, 'Vui lòng chọn năm học.'),
    acceptTerms: z.literal(true, { message: 'Bạn cần đồng ý điều khoản.' }),
    marketing: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu xác nhận chưa khớp.',
  });
type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { marketing: false },
  });
  const submit = async () => {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 700));
    navigate('/verify-email?status=sent');
  };
  return (
    <AuthShell
      description="Tạo hồ sơ để nhận gợi ý và nhắc hạn phù hợp với mục tiêu của bạn."
      title="Tạo tài khoản sinh viên"
    >
      <form className="grid gap-5" onSubmit={handleSubmit(submit)} noValidate>
        <div className="form-grid">
          <FormField error={errors.fullName?.message} htmlFor="fullName" label="Họ và tên">
            <input className="field-control" id="fullName" {...register('fullName')} />
          </FormField>
          <FormField error={errors.email?.message} htmlFor="email" label="Email">
            <input className="field-control" id="email" type="email" {...register('email')} />
          </FormField>
          <FormField error={errors.password?.message} htmlFor="password" label="Mật khẩu">
            <input
              className="field-control"
              id="password"
              type="password"
              {...register('password')}
            />
          </FormField>
          <FormField
            error={errors.confirmPassword?.message}
            htmlFor="confirmPassword"
            label="Xác nhận mật khẩu"
          >
            <input
              className="field-control"
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
            />
          </FormField>
          <FormField
            error={errors.university?.message}
            htmlFor="university"
            label="Trường/cơ sở đào tạo"
          >
            <input className="field-control" id="university" {...register('university')} />
          </FormField>
          <FormField error={errors.major?.message} htmlFor="major" label="Chuyên ngành">
            <input className="field-control" id="major" {...register('major')} />
          </FormField>
          <FormField error={errors.studyYear?.message} htmlFor="studyYear" label="Năm học">
            <select className="field-control" id="studyYear" {...register('studyYear')}>
              <option value="">Chọn năm học</option>
              <option>Năm 1</option>
              <option>Năm 2</option>
              <option>Năm 3</option>
              <option>Năm 4</option>
              <option>Khác</option>
            </select>
          </FormField>
        </div>
        <label className="text-muted-500 flex items-start gap-3 text-sm leading-6">
          <input
            className="accent-primary-500 mt-1 size-4 shrink-0"
            type="checkbox"
            {...register('acceptTerms')}
          />
          <span>Tôi đồng ý với điều khoản sử dụng và chính sách quyền riêng tư.</span>
        </label>
        {errors.acceptTerms ? (
          <span className="field-error">{errors.acceptTerms.message}</span>
        ) : null}
        <label className="text-muted-500 flex items-start gap-3 text-sm leading-6">
          <input
            className="accent-primary-500 mt-1 size-4 shrink-0"
            type="checkbox"
            {...register('marketing')}
          />
          <span>Nhận thông tin cơ hội mới và nội dung hữu ích (không bắt buộc).</span>
        </label>
        <Button className="w-full" isLoading={isSubmitting} type="submit">
          Đăng ký
        </Button>
        <p className="text-muted-500 text-center text-sm">
          Đã có tài khoản?{' '}
          <Link className="text-primary-500 font-bold" to="/login">
            Đăng nhập
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
