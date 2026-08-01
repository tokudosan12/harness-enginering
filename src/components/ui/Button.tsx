import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  className,
  isLoading,
  disabled,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn('btn', `btn-${variant}`, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <LoaderCircle aria-hidden="true" className="animate-spin" size={17} /> : null}
      {children}
    </button>
  );
}
