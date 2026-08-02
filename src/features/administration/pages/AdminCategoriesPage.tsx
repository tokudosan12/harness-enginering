import { Plus, Power, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { WorkspacePageHeading } from '@/components/workspace/WorkspaceUI';
import { useOperationsStore } from '@/stores/operationsStore';

export function AdminCategoriesPage() {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const categories = useOperationsStore((state) => state.categories);
  const toggleCategory = useOperationsStore((state) => state.toggleCategory);
  const addCategory = useOperationsStore((state) => state.addCategory);
  const filtered = useMemo(
    () =>
      categories.filter(
        (category) =>
          !search ||
          category.label.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi')),
      ),
    [categories, search],
  );
  const submit = () => {
    if (label.trim().length < 3 || description.trim().length < 10) return;
    addCategory({
      id: `CUSTOM_${Date.now()}`,
      label: label.trim(),
      description: description.trim(),
      active: true,
      opportunityCount: 0,
    });
    setLabel('');
    setDescription('');
    setIsAdding(false);
  };
  return (
    <>
      <WorkspacePageHeading
        actions={
          <Button onClick={() => setIsAdding((value) => !value)}>
            <Plus size={18} /> Thêm danh mục
          </Button>
        }
        description="Quản lý taxonomy hiển thị trong bộ lọc, biểu mẫu đối tác và báo cáo."
        title="Danh mục cơ hội"
      />
      {isAdding ? (
        <section className="workspace-panel workspace-inline-form">
          <label className="field-label">
            Tên danh mục
            <input
              className="field-control"
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Ví dụ: Chương trình trao đổi"
              value={label}
            />
          </label>
          <label className="field-label">
            Mô tả
            <input
              className="field-control"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Mục đích và phạm vi danh mục"
              value={description}
            />
          </label>
          <Button
            disabled={label.trim().length < 3 || description.trim().length < 10}
            onClick={submit}
          >
            Lưu danh mục
          </Button>
        </section>
      ) : null}
      <section className="workspace-panel">
        <div className="workspace-toolbar">
          <label className="input-shell workspace-toolbar-search">
            <Search size={17} />
            <input
              aria-label="Tìm danh mục"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo tên..."
              value={search}
            />
          </label>
          <span className="workspace-result-count">{filtered.length} danh mục</span>
        </div>
        <div className="workspace-category-grid">
          {filtered.map((category) => (
            <article
              className={`workspace-category-card ${category.active ? '' : 'is-disabled'}`}
              key={category.id}
            >
              <div>
                <span>{category.opportunityCount}</span>
                <small>cơ hội</small>
              </div>
              <h2>{category.label}</h2>
              <p>{category.description}</p>
              <footer>
                <span
                  className={`user-status user-status-${category.active ? 'active' : 'suspended'}`}
                >
                  {category.active ? 'Đang hoạt động' : 'Đã tắt'}
                </span>
                <Button
                  aria-label={`${category.active ? 'Tắt' : 'Bật'} ${category.label}`}
                  onClick={() => toggleCategory(category.id)}
                  variant={category.active ? 'danger' : 'secondary'}
                >
                  <Power size={16} /> {category.active ? 'Tắt' : 'Bật'}
                </Button>
              </footer>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
