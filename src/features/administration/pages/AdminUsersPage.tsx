import { Search, ShieldBan, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EmptyTableState, WorkspacePageHeading } from '@/components/workspace/WorkspaceUI';
import type { UserRole } from '@/shared/types/user';
import { useOperationsStore } from '@/stores/operationsStore';

const roleLabels: Record<UserRole, string> = {
  STUDENT: 'Sinh viên',
  PARTNER: 'Đối tác',
  MODERATOR: 'Kiểm duyệt',
  ADMINISTRATOR: 'Quản trị',
};

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'ALL' | UserRole>('ALL');
  const users = useOperationsStore((state) => state.users);
  const updateUserRole = useOperationsStore((state) => state.updateUserRole);
  const updateUserStatus = useOperationsStore((state) => state.updateUserStatus);
  const filtered = useMemo(
    () =>
      users.filter(
        (user) =>
          (role === 'ALL' || user.role === role) &&
          (!search ||
            `${user.name} ${user.email}`
              .toLocaleLowerCase('vi')
              .includes(search.toLocaleLowerCase('vi'))),
      ),
    [role, search, users],
  );
  return (
    <>
      <WorkspacePageHeading
        description="Tìm kiếm, phân quyền và kiểm soát trạng thái truy cập của tài khoản."
        title="Người dùng & quyền"
      />
      <section className="workspace-panel">
        <div className="workspace-toolbar">
          <label className="input-shell workspace-toolbar-search">
            <Search size={17} />
            <input
              aria-label="Tìm người dùng"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tên hoặc email..."
              value={search}
            />
          </label>
          <label className="workspace-select-label">
            <span>Vai trò</span>
            <select
              className="field-control"
              onChange={(event) => setRole(event.target.value as 'ALL' | UserRole)}
              value={role}
            >
              <option value="ALL">Tất cả</option>
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <span className="workspace-result-count">{filtered.length} tài khoản</span>
        </div>
        {filtered.length ? (
          <div className="workspace-table-wrap">
            <table className="workspace-table workspace-action-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Ngày tham gia</th>
                  <th>Hoạt động cuối</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="workspace-user-cell">
                        <span>{user.name.slice(0, 1)}</span>
                        <div>
                          <strong>{user.name}</strong>
                          <small>{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <select
                        aria-label={`Vai trò của ${user.name}`}
                        className="workspace-table-select"
                        onChange={(event) =>
                          updateUserRole(user.id, event.target.value as UserRole)
                        }
                        value={user.role}
                      >
                        {Object.entries(roleLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className={`user-status user-status-${user.status.toLowerCase()}`}>
                        {user.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td>{new Date(user.joinedAt).toLocaleDateString('vi-VN')}</td>
                    <td>{new Date(user.lastActiveAt).toLocaleString('vi-VN')}</td>
                    <td>
                      <Button
                        aria-label={
                          user.status === 'ACTIVE' ? `Khóa ${user.name}` : `Mở khóa ${user.name}`
                        }
                        onClick={() =>
                          updateUserStatus(
                            user.id,
                            user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
                          )
                        }
                        variant={user.status === 'ACTIVE' ? 'danger' : 'secondary'}
                      >
                        {user.status === 'ACTIVE' ? (
                          <ShieldBan size={16} />
                        ) : (
                          <ShieldCheck size={16} />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyTableState
            title="Không tìm thấy tài khoản"
            description="Thử thay đổi từ khóa hoặc vai trò."
          />
        )}
      </section>
    </>
  );
}
