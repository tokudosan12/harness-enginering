export function CardSkeleton() {
  return (
    <div aria-hidden="true" className="surface-card overflow-hidden">
      <div className="skeleton aspect-[16/9]" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="skeleton h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}
