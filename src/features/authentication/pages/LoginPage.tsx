import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Eye, EyeOff, ShieldCheck, UserRound, Wrench } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { AuthShell, FormField } from '@/features/authentication/components/AuthShell';
import { MOCK_ACCOUNTS, roleHome, useAuthStore } from '@/stores/authStore';

const roleMeta = {
  STUDENT: { label: 'Sinh viên', icon: UserRound },
  PARTNER: { label: 'Đối tác', icon: Building2 },
  MODERATOR: { label: 'Kiểm duyệt', icon: ShieldCheck },
  ADMINISTRATOR: { label: 'Quản trị', icon: Wrench },
} as const;

const loginSchema = z.object({
  email: z.email('Email chưa đúng định dạng.'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu.'),
  remember: z.boolean(),
});
type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'student@example.com', password: 'Student@123', remember: true },
  });
  const submit = async (values: LoginValues) => {
    setSubmitError('');
    try {
      const user = await login(values.email, values.password);
      const redirect = params.get('redirect');
      navigate(redirect && user.role === 'STUDENT' ? redirect : roleHome(user.role), {
        replace: true,
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Đăng nhập thất bại.');
    }
  };
  return (
    <AuthShell
      description="Tiếp tục hành trình khám phá và theo dõi cơ hội của bạn."
      title="Chào mừng bạn trở lại"
    >
      <form className="grid gap-5" onSubmit={handleSubmit(submit)} noValidate>
        <FormField error={errors.email?.message} htmlFor="email" label="Email">
          <input
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="field-control"
            id="email"
            type="email"
            {...register('email')}
          />
        </FormField>
        <FormField error={errors.password?.message} htmlFor="password" label="Mật khẩu">
          <div className="password-field">
            <input
              aria-describedby={errors.password ? 'password-error' : undefined}
              className="field-control"
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
            />
            <button
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              onClick={() => setShowPassword((value) => !value)}
              type="button"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </FormField>
        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="text-muted-500 flex items-center gap-2">
            <input
              className="accent-primary-500 size-4"
              type="checkbox"
              {...register('remember')}
            />{' '}
            Ghi nhớ đăng nhập
          </label>
          <Link className="text-primary-500 font-bold" to="/forgot-password">
            Quên mật khẩu?
          </Link>
        </div>
        {submitError ? (
          <div className="auth-error" role="alert">
            {submitError}
          </div>
        ) : null}
        <Button className="w-full" isLoading={isSubmitting} type="submit">
          Đăng nhập
        </Button>
        <p className="text-muted-500 text-center text-sm">
          Chưa có tài khoản?{' '}
          <Link className="text-primary-500 font-bold" to="/register">
            Đăng ký miễn phí
          </Link>
        </p>
      </form>
      <div className="mock-account-panel">
        <div>
          <strong>Tài khoản demo để test</strong>
          <span>Chọn một vai trò để tự điền email và mật khẩu.</span>
        </div>
        <div className="mock-account-grid">
          {MOCK_ACCOUNTS.map((account) => {
            const meta = roleMeta[account.role];
            const Icon = meta.icon;
            return (
              <button
                key={account.role}
                onClick={() => {
                  setValue('email', account.email, { shouldValidate: true });
                  setValue('password', account.password, { shouldValidate: true });
                  setSubmitError('');
                }}
                type="button"
              >
                <Icon size={18} />
                <span>
                  <strong>{meta.label}</strong>
                  <small>{account.email}</small>
                  <small>{account.password}</small>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </AuthShell>
  );
}
