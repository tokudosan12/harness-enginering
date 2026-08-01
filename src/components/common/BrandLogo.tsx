import { DoorOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      aria-label="Student Opportunity Hub - Trang chủ"
      className="flex shrink-0 items-center gap-2.5"
      to="/"
    >
      <span className="bg-primary-500 grid size-9 place-items-center rounded-[10px] text-white shadow-sm">
        <DoorOpen aria-hidden="true" size={21} strokeWidth={2.2} />
      </span>
      {!compact ? (
        <span className="text-navy-950 max-w-[145px] text-[15px] leading-[1.05] font-extrabold tracking-[-0.02em]">
          Student
          <br />
          Opportunity Hub
        </span>
      ) : null}
    </Link>
  );
}
