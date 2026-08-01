import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, MailCheck, RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { AuthShell, FormField } from '@/features/authentication/components/AuthShell';

const emailSchema = z.object({ email: z.email('Email chưa đúng định dạng.') });
type EmailValues = z.infer<typeof emailSchema>;

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailValues>({ resolver: zodResolver(emailSchema) });
  const submit = async () => {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 600));
    setSent(true);
  };
  return (
    <AuthShell
      description="Nhập email đã đăng ký. Chúng tôi sẽ mô phỏng việc gửi liên kết đặt lại mật khẩu."
      title="Quên mật khẩu"
    >
      {sent ? (
        <div className="success-panel">
          <MailCheck size={30} />
          <h2>Kiểm tra hộp thư của bạn</h2>
          <p>
            Liên kết đặt lại mật khẩu mock đã được gửi. Liên kết chỉ dùng một lần và có thời hạn.
          </p>
          <Link className="btn btn-primary w-full" to="/login">
            Quay lại đăng nhập
          </Link>
        </div>
      ) : (
        <form className="grid gap-5" onSubmit={handleSubmit(submit)} noValidate>
          <FormField error={errors.email?.message} htmlFor="email" label="Email">
            <input className="field-control" id="email" type="email" {...register('email')} />
          </FormField>
          <Button className="w-full" isLoading={isSubmitting} type="submit">
            Gửi liên kết
          </Button>
          <Link className="text-primary-500 text-center text-sm font-bold" to="/login">
            Quay lại đăng nhập
          </Link>
        </form>
      )}
    </AuthShell>
  );
}

export function VerifyEmailPage() {
  const [seconds, setSeconds] = useState(30);
  const [verified, setVerified] = useState(false);
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);
  const resend = () => setSeconds(30);
  return (
    <AuthShell
      description="Hoàn tất một bước nữa để bảo vệ tài khoản và nhận thông báo chính xác."
      title="Xác minh email"
    >
      <div className="success-panel">
        {verified ? <CheckCircle2 size={34} /> : <MailCheck size={34} />}
        <h2>{verified ? 'Email đã được xác minh' : 'Chúng tôi đã gửi email xác minh'}</h2>
        <p>
          {verified
            ? 'Tài khoản mock đã sẵn sàng để đăng nhập.'
            : 'Vui lòng kiểm tra hộp thư và nhấp vào liên kết xác minh. Đây là luồng mô phỏng frontend.'}
        </p>
        {!verified ? (
          <>
            <Button className="w-full" onClick={() => setVerified(true)}>
              Mô phỏng xác minh thành công
            </Button>
            <Button className="w-full" disabled={seconds > 0} onClick={resend} variant="secondary">
              <RotateCw size={16} />
              {seconds > 0 ? `Gửi lại sau ${seconds}s` : 'Gửi lại email'}
            </Button>
          </>
        ) : (
          <Link className="btn btn-primary w-full" to="/login">
            Đăng nhập
          </Link>
        )}
      </div>
    </AuthShell>
  );
}
