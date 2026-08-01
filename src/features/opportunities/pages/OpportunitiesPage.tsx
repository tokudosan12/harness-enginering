import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OpportunityCard } from '@/components/common/OpportunityCard';
import { CardSkeleton } from '@/components/feedback/CardSkeleton';
import { EmptyState, ErrorState } from '@/components/feedback/StateViews';
import { Button } from '@/components/ui/Button';
import { mockOpportunities } from '@/mocks/data/opportunities';
import { getPublicOpportunities } from '@/mocks/services/opportunityService';
import {
  ALL_CATEGORIES,
  ALL_MODES,
  CATEGORY_LABELS,
  MODE_LABELS,
} from '@/shared/constants/opportunities';
import type {
  OpportunityCategory,
  OpportunityFilters,
  OpportunitySort,
  ParticipationMode,
} from '@/shared/types/opportunity';

function parseList<T extends string>(value: string | null): T[] {
  return value ? (value.split(',').filter(Boolean) as T[]) : [];
}

function unique(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))].sort((a, b) =>
    a.localeCompare(b, 'vi'),
  );
}

const filterOptions = {
  fields: unique(mockOpportunities.flatMap((item) => item.fields)),
  skills: unique(mockOpportunities.flatMap((item) => item.skills)),
  locations: unique(mockOpportunities.map((item) => item.location)),
  audiences: unique(mockOpportunities.flatMap((item) => item.targetAudience)),
  organizations: unique(mockOpportunities.map((item) => item.organization.name)),
};

type ListFilterKey = 'field' | 'skill' | 'location' | 'audience' | 'organization';

interface FilterPanelProps {
  categories: OpportunityCategory[];
  modes: ParticipationMode[];
  selections: Record<ListFilterKey, string[]>;
  deadline: string;
  onToggleCategory: (category: OpportunityCategory) => void;
  onToggleMode: (mode: ParticipationMode) => void;
  onToggleList: (key: ListFilterKey, value: string) => void;
  onDeadlineChange: (value: string) => void;
  onClear: () => void;
}

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <div className="filter-options-scroll">
        {options.map((option) => (
          <label className="filter-option" key={option}>
            <input
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              type="checkbox"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function FilterPanel({
  categories,
  modes,
  selections,
  deadline,
  onToggleCategory,
  onToggleMode,
  onToggleList,
  onDeadlineChange,
  onClear,
}: FilterPanelProps) {
  return (
    <div className="filter-panel">
      <div className="border-line-200 flex items-center justify-between border-b pb-4">
        <h2 className="flex items-center gap-2 font-extrabold">
          <SlidersHorizontal size={18} /> Bộ lọc
        </h2>
        <button className="text-primary-500 text-xs font-bold" onClick={onClear} type="button">
          Xóa tất cả
        </button>
      </div>
      <fieldset>
        <legend>Loại cơ hội</legend>
        {ALL_CATEGORIES.map((category) => (
          <label className="filter-option" key={category}>
            <input
              checked={categories.includes(category)}
              onChange={() => onToggleCategory(category)}
              type="checkbox"
            />
            <span>{CATEGORY_LABELS[category]}</span>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Hình thức</legend>
        {ALL_MODES.map((mode) => (
          <label className="filter-option" key={mode}>
            <input
              checked={modes.includes(mode)}
              onChange={() => onToggleMode(mode)}
              type="checkbox"
            />
            <span>{MODE_LABELS[mode]}</span>
          </label>
        ))}
      </fieldset>
      <CheckboxGroup
        label="Lĩnh vực"
        onToggle={(value) => onToggleList('field', value)}
        options={filterOptions.fields}
        selected={selections.field}
      />
      <CheckboxGroup
        label="Kỹ năng"
        onToggle={(value) => onToggleList('skill', value)}
        options={filterOptions.skills}
        selected={selections.skill}
      />
      <CheckboxGroup
        label="Địa điểm"
        onToggle={(value) => onToggleList('location', value)}
        options={filterOptions.locations}
        selected={selections.location}
      />
      <CheckboxGroup
        label="Đối tượng"
        onToggle={(value) => onToggleList('audience', value)}
        options={filterOptions.audiences}
        selected={selections.audience}
      />
      <CheckboxGroup
        label="Đơn vị tổ chức"
        onToggle={(value) => onToggleList('organization', value)}
        options={filterOptions.organizations}
        selected={selections.organization}
      />
      <fieldset>
        <legend>Hạn đăng ký</legend>
        <select
          aria-label="Lọc theo hạn đăng ký"
          className="field-control"
          onChange={(event) => onDeadlineChange(event.target.value)}
          value={deadline}
        >
          <option value="">Tất cả thời hạn</option>
          <option value="7">Trong 7 ngày</option>
          <option value="30">Trong 30 ngày</option>
          <option value="60">Trong 60 ngày</option>
        </select>
      </fieldset>
    </div>
  );
}

export function OpportunitiesPage() {
  const [params, setParams] = useSearchParams();
  const [draftSearch, setDraftSearch] = useState(params.get('search') ?? '');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const categories = useMemo(
    () => parseList<OpportunityCategory>(params.get('category')),
    [params],
  );
  const modes = useMemo(() => parseList<ParticipationMode>(params.get('mode')), [params]);
  const selections = useMemo(
    () => ({
      field: parseList<string>(params.get('field')),
      skill: parseList<string>(params.get('skill')),
      location: parseList<string>(params.get('location')),
      audience: parseList<string>(params.get('audience')),
      organization: parseList<string>(params.get('organization')),
    }),
    [params],
  );
  const search = params.get('search') ?? '';
  const deadline = params.get('deadline') ?? '';
  const sort = (params.get('sort') as OpportunitySort | null) ?? 'newest';
  const filters: OpportunityFilters = {
    search,
    categories,
    modes,
    fields: selections.field,
    skills: selections.skill,
    locations: selections.location,
    audiences: selections.audience,
    organizations: selections.organization,
    deadlineDays: deadline ? Number(deadline) : undefined,
    sort,
  };

  const query = useQuery({
    queryKey: ['opportunities', params.toString()],
    queryFn: () => getPublicOpportunities(filters),
  });

  const updateParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setVisibleCount(8);
    setParams(next);
  };
  const toggleValue = (key: string, values: string[], value: string) =>
    updateParam(
      key,
      values.includes(value)
        ? values.filter((item) => item !== value).join(',')
        : [...values, value].join(','),
    );
  const toggleCategory = (category: OpportunityCategory) =>
    toggleValue('category', categories, category);
  const toggleMode = (mode: ParticipationMode) => toggleValue('mode', modes, mode);
  const toggleList = (key: ListFilterKey, value: string) =>
    toggleValue(key, selections[key], value);
  const clear = () => {
    setDraftSearch('');
    setParams({});
  };
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    updateParam('search', draftSearch.trim());
  };
  const activeLabels = [
    ...categories.map((item) => ({
      key: `category-${item}`,
      label: CATEGORY_LABELS[item],
      remove: () => toggleCategory(item),
    })),
    ...modes.map((item) => ({
      key: `mode-${item}`,
      label: MODE_LABELS[item],
      remove: () => toggleMode(item),
    })),
    ...Object.entries(selections).flatMap(([key, values]) =>
      values.map((value) => ({
        key: `${key}-${value}`,
        label: value,
        remove: () => toggleList(key as ListFilterKey, value),
      })),
    ),
    ...(deadline
      ? [
          {
            key: 'deadline',
            label: `Hạn trong ${deadline} ngày`,
            remove: () => updateParam('deadline'),
          },
        ]
      : []),
  ];

  const panelProps: FilterPanelProps = {
    categories,
    modes,
    selections,
    deadline,
    onClear: clear,
    onToggleCategory: toggleCategory,
    onToggleMode: toggleMode,
    onToggleList: toggleList,
    onDeadlineChange: (value) => updateParam('deadline', value),
  };

  return (
    <div className="opportunities-page">
      <section className="opportunities-intro">
        <div className="page-container">
          <h1>Khám phá cơ hội</h1>
          <p>Tìm kiếm và chọn lọc những cơ hội phù hợp để phát triển bản thân và sự nghiệp.</p>
        </div>
      </section>
      <div className="page-container opportunities-layout">
        <aside className="hidden lg:block">
          <FilterPanel {...panelProps} />
        </aside>
        <section className="min-w-0">
          <div className="search-toolbar">
            <form className="input-shell flex-1" onSubmit={submitSearch}>
              <Search size={18} />
              <input
                aria-label="Tìm kiếm cơ hội"
                onChange={(event) => setDraftSearch(event.target.value)}
                placeholder="Tìm theo tiêu đề, đơn vị hoặc kỹ năng"
                value={draftSearch}
              />
              <button className="sr-only" type="submit">
                Tìm kiếm
              </button>
            </form>
            <Button className="lg:hidden" onClick={() => setIsDrawerOpen(true)} variant="secondary">
              <Filter size={17} /> Bộ lọc
            </Button>
            <label className="sort-control">
              Sắp xếp
              <select
                aria-label="Sắp xếp kết quả"
                onChange={(event) => updateParam('sort', event.target.value)}
                value={sort}
              >
                <option value="newest">Mới nhất</option>
                <option value="deadline">Gần hết hạn</option>
                <option value="relevance">Phù hợp nhất</option>
              </select>
            </label>
          </div>
          {activeLabels.length > 0 || search ? (
            <div className="active-filters">
              {search ? (
                <button onClick={() => updateParam('search')} type="button">
                  Từ khóa: {search}
                  <X size={13} />
                </button>
              ) : null}
              {activeLabels.map((item) => (
                <button key={item.key} onClick={item.remove} type="button">
                  {item.label}
                  <X size={13} />
                </button>
              ))}
              <button className="clear-filter" onClick={clear} type="button">
                Xóa tất cả
              </button>
            </div>
          ) : null}
          <div className="results-heading">
            <p>
              <strong>{query.data?.length ?? 0}</strong> kết quả phù hợp
            </p>
            <span>Chỉ hiển thị bài đang mở và chưa hết hạn</span>
          </div>
          {query.isLoading ? (
            <div className="grid gap-4">
              {Array.from({ length: 4 }, (_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : null}
          {query.isError ? <ErrorState onRetry={() => void query.refetch()} /> : null}
          {query.isSuccess && query.data.length === 0 ? (
            <EmptyState
              action={<Button onClick={clear}>Xóa bộ lọc</Button>}
              description="Thử thay đổi từ khóa hoặc bỏ bớt bộ lọc để xem nhiều cơ hội hơn."
              title="Không tìm thấy cơ hội phù hợp"
            />
          ) : null}
          {query.isSuccess && query.data.length > 0 ? (
            <div className="grid gap-4">
              {query.data.slice(0, visibleCount).map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} variant="list" />
              ))}
            </div>
          ) : null}
          {query.data && visibleCount < query.data.length ? (
            <div className="mt-7 text-center">
              <Button onClick={() => setVisibleCount((count) => count + 8)} variant="secondary">
                Tải thêm cơ hội
              </Button>
            </div>
          ) : null}
        </section>
      </div>
      {isDrawerOpen ? (
        <div
          aria-label="Bộ lọc cơ hội"
          aria-modal="true"
          className="filter-drawer-wrap"
          role="dialog"
        >
          <button
            aria-label="Đóng bộ lọc"
            className="drawer-backdrop"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="filter-drawer">
            <div className="border-line-200 flex items-center justify-between border-b p-4">
              <strong>Bộ lọc cơ hội</strong>
              <button
                aria-label="Đóng bộ lọc"
                className="mobile-menu-button"
                onClick={() => setIsDrawerOpen(false)}
              >
                <X />
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <FilterPanel {...panelProps} />
            </div>
            <div className="border-line-200 border-t p-4">
              <Button className="w-full" onClick={() => setIsDrawerOpen(false)}>
                Xem {query.data?.length ?? 0} kết quả
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
