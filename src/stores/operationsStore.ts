import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AuditEntry,
  ContentReport,
  ManagedCategory,
  ManagedUser,
  OrganizationProfile,
  PartnerPost,
  PartnerPostInput,
} from '@/shared/types/operations';
import type { OpportunityStatus } from '@/shared/types/opportunity';
import type { UserRole } from '@/shared/types/user';

const initialPosts: PartnerPost[] = [
  {
    id: 'partner-post-1',
    title: 'Thực tập Product Design 2026',
    summary: 'Chương trình thực tập 12 tuần dành cho sinh viên yêu thích thiết kế sản phẩm số.',
    description:
      'Bạn sẽ làm việc cùng đội ngũ sản phẩm, tham gia nghiên cứu người dùng, thiết kế prototype và trình bày giải pháp trong buổi demo cuối kỳ.',
    category: 'INTERNSHIP',
    mode: 'HYBRID',
    location: 'TP. Hồ Chí Minh',
    deadline: '2026-09-30',
    status: 'OPEN',
    updatedAt: '2026-08-01T08:30:00.000Z',
    views: 1248,
    saves: 186,
    applications: 74,
  },
  {
    id: 'partner-post-2',
    title: 'Future Founders Hackathon',
    summary: '48 giờ phát triển giải pháp công nghệ cho giáo dục và phát triển bền vững.',
    description:
      'Các đội từ 3 đến 5 thành viên nhận cố vấn từ chuyên gia, dữ liệu mẫu và cơ hội trình bày trước quỹ đầu tư.',
    category: 'HACKATHON',
    mode: 'OFFLINE',
    location: 'Hà Nội',
    deadline: '2026-10-12',
    status: 'PENDING_REVIEW',
    updatedAt: '2026-08-01T10:20:00.000Z',
    views: 0,
    saves: 0,
    applications: 0,
  },
  {
    id: 'partner-post-3',
    title: 'Học bổng Women in Technology',
    summary: 'Học bổng học tập và mentoring dành cho nữ sinh theo đuổi ngành công nghệ.',
    description:
      'Gói hỗ trợ gồm học phí, cố vấn nghề nghiệp và chuỗi workshop kỹ năng trong sáu tháng.',
    category: 'SCHOLARSHIP',
    mode: 'ONLINE',
    location: 'Toàn quốc',
    deadline: '2026-11-15',
    status: 'REVISION_REQUIRED',
    updatedAt: '2026-07-31T03:10:00.000Z',
    views: 0,
    saves: 0,
    applications: 0,
    reviewerNote: 'Vui lòng bổ sung tiêu chí xét chọn và đường dẫn thể lệ chính thức.',
  },
  {
    id: 'partner-post-4',
    title: 'Startup Growth Intern',
    summary: 'Cơ hội thực tập tăng trưởng tại startup SaaS giai đoạn mở rộng thị trường.',
    description:
      'Tham gia nghiên cứu thị trường, vận hành chiến dịch và phân tích dữ liệu tăng trưởng.',
    category: 'STARTUP_JOB',
    mode: 'HYBRID',
    location: 'Đà Nẵng',
    deadline: '2026-12-05',
    status: 'DRAFT',
    updatedAt: '2026-07-29T09:00:00.000Z',
    views: 0,
    saves: 0,
    applications: 0,
  },
];

const initialUsers: ManagedUser[] = [
  {
    id: 'u1',
    name: 'Minh Anh',
    email: 'student@example.com',
    role: 'STUDENT',
    status: 'ACTIVE',
    joinedAt: '2026-03-12',
    lastActiveAt: '2026-08-02T07:10:00.000Z',
  },
  {
    id: 'u2',
    name: 'Đối tác Demo',
    email: 'partner@example.com',
    role: 'PARTNER',
    status: 'ACTIVE',
    joinedAt: '2026-02-05',
    lastActiveAt: '2026-08-02T06:45:00.000Z',
  },
  {
    id: 'u3',
    name: 'Ngọc Lan',
    email: 'lan.ngoc@example.com',
    role: 'STUDENT',
    status: 'ACTIVE',
    joinedAt: '2026-05-21',
    lastActiveAt: '2026-08-01T13:20:00.000Z',
  },
  {
    id: 'u4',
    name: 'Future Lab',
    email: 'hello@futurelab.vn',
    role: 'PARTNER',
    status: 'SUSPENDED',
    joinedAt: '2026-01-17',
    lastActiveAt: '2026-07-28T03:35:00.000Z',
  },
  {
    id: 'u5',
    name: 'Kiểm duyệt viên',
    email: 'moderator@example.com',
    role: 'MODERATOR',
    status: 'ACTIVE',
    joinedAt: '2025-12-01',
    lastActiveAt: '2026-08-02T05:12:00.000Z',
  },
  {
    id: 'u6',
    name: 'Quản trị viên',
    email: 'admin@example.com',
    role: 'ADMINISTRATOR',
    status: 'ACTIVE',
    joinedAt: '2025-11-15',
    lastActiveAt: '2026-08-02T04:58:00.000Z',
  },
];

const initialCategories: ManagedCategory[] = [
  {
    id: 'INTERNSHIP',
    label: 'Thực tập',
    description: 'Cơ hội trải nghiệm nghề nghiệp có thời hạn.',
    active: true,
    opportunityCount: 42,
  },
  {
    id: 'STARTUP_JOB',
    label: 'Việc làm startup',
    description: 'Vị trí tại doanh nghiệp khởi nghiệp.',
    active: true,
    opportunityCount: 31,
  },
  {
    id: 'INNOVATION_COMPETITION',
    label: 'Cuộc thi đổi mới',
    description: 'Cuộc thi ý tưởng và đổi mới sáng tạo.',
    active: true,
    opportunityCount: 18,
  },
  {
    id: 'HACKATHON',
    label: 'Hackathon',
    description: 'Sự kiện phát triển giải pháp theo thời gian.',
    active: true,
    opportunityCount: 16,
  },
  {
    id: 'SCHOLARSHIP',
    label: 'Học bổng',
    description: 'Hỗ trợ học phí, nghiên cứu và phát triển.',
    active: true,
    opportunityCount: 27,
  },
  {
    id: 'INVESTMENT_FUND',
    label: 'Quỹ đầu tư',
    description: 'Nguồn vốn cho dự án sinh viên và startup.',
    active: true,
    opportunityCount: 8,
  },
  {
    id: 'INCUBATION_PROGRAM',
    label: 'Chương trình ươm tạo',
    description: 'Cố vấn và tăng tốc dự án khởi nghiệp.',
    active: true,
    opportunityCount: 12,
  },
];

const initialReports: ContentReport[] = [
  {
    id: 'report-1',
    opportunityTitle: 'Remote Internship Program',
    reason: 'Đường dẫn đăng ký không hoạt động',
    reporter: 'minhanh@example.com',
    createdAt: '2026-08-02T02:15:00.000Z',
    status: 'OPEN',
    priority: 'HIGH',
  },
  {
    id: 'report-2',
    opportunityTitle: 'AI Innovation Challenge',
    reason: 'Thông tin thời hạn không thống nhất',
    reporter: 'lan.ngoc@example.com',
    createdAt: '2026-08-01T08:40:00.000Z',
    status: 'INVESTIGATING',
    priority: 'MEDIUM',
  },
  {
    id: 'report-3',
    opportunityTitle: 'Green Startup Fellowship',
    reason: 'Nội dung có dấu hiệu trùng lặp',
    reporter: 'student08@example.com',
    createdAt: '2026-07-31T11:05:00.000Z',
    status: 'OPEN',
    priority: 'LOW',
  },
];

const initialAudit: AuditEntry[] = [
  {
    id: 'audit-1',
    actor: 'Quản trị viên',
    action: 'Cập nhật vai trò',
    target: 'moderator@example.com',
    createdAt: '2026-08-01T04:10:00.000Z',
    severity: 'INFO',
  },
  {
    id: 'audit-2',
    actor: 'Kiểm duyệt viên',
    action: 'Yêu cầu chỉnh sửa bài',
    target: 'Học bổng Women in Technology',
    createdAt: '2026-07-31T03:10:00.000Z',
    severity: 'WARNING',
  },
  {
    id: 'audit-3',
    actor: 'Hệ thống',
    action: 'Phát hiện đăng nhập bất thường',
    target: 'hello@futurelab.vn',
    createdAt: '2026-07-29T09:22:00.000Z',
    severity: 'CRITICAL',
  },
];

interface OperationsState {
  posts: PartnerPost[];
  organization: OrganizationProfile;
  reports: ContentReport[];
  users: ManagedUser[];
  categories: ManagedCategory[];
  audit: AuditEntry[];
  savePost: (input: PartnerPostInput, id?: string, submit?: boolean) => string;
  changePostStatus: (id: string, status: OpportunityStatus, note?: string) => void;
  updateOrganization: (profile: OrganizationProfile) => void;
  updateReport: (id: string, status: ContentReport['status']) => void;
  updateUserStatus: (id: string, status: ManagedUser['status']) => void;
  updateUserRole: (id: string, role: UserRole) => void;
  toggleCategory: (id: ManagedCategory['id']) => void;
  addCategory: (category: ManagedCategory) => void;
}

const now = () => new Date().toISOString();
const auditEntry = (
  action: string,
  target: string,
  severity: AuditEntry['severity'] = 'INFO',
): AuditEntry => ({
  id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  actor: 'Tài khoản demo',
  action,
  target,
  createdAt: now(),
  severity,
});

export const useOperationsStore = create<OperationsState>()(
  persist(
    (set) => ({
      posts: initialPosts,
      organization: {
        name: 'Future Skills Vietnam',
        website: 'https://futureskills.example.com',
        email: 'partner@example.com',
        phone: '028 7300 2026',
        address: 'Quận 1, TP. Hồ Chí Minh',
        description:
          'Tổ chức kết nối sinh viên với chương trình học tập và cơ hội nghề nghiệp chất lượng.',
        verified: true,
      },
      reports: initialReports,
      users: initialUsers,
      categories: initialCategories,
      audit: initialAudit,
      savePost: (input, id, submit = false) => {
        const postId = id ?? `partner-post-${Date.now()}`;
        set((state) => {
          const existing = state.posts.find((post) => post.id === postId);
          const post: PartnerPost = {
            ...input,
            id: postId,
            status: submit
              ? 'PENDING_REVIEW'
              : existing?.status === 'REVISION_REQUIRED'
                ? 'REVISION_REQUIRED'
                : 'DRAFT',
            updatedAt: now(),
            views: existing?.views ?? 0,
            saves: existing?.saves ?? 0,
            applications: existing?.applications ?? 0,
            reviewerNote: existing?.reviewerNote,
          };
          return {
            posts: existing
              ? state.posts.map((item) => (item.id === postId ? post : item))
              : [post, ...state.posts],
            audit: [
              auditEntry(submit ? 'Gửi bài kiểm duyệt' : 'Lưu bản nháp', input.title),
              ...state.audit,
            ],
          };
        });
        return postId;
      },
      changePostStatus: (id, status, note) =>
        set((state) => {
          const target = state.posts.find((post) => post.id === id);
          return {
            posts: state.posts.map((post) =>
              post.id === id ? { ...post, status, reviewerNote: note, updatedAt: now() } : post,
            ),
            audit: target
              ? [
                  auditEntry(
                    `Chuyển trạng thái sang ${status}`,
                    target.title,
                    status === 'HIDDEN' ? 'WARNING' : 'INFO',
                  ),
                  ...state.audit,
                ]
              : state.audit,
          };
        }),
      updateOrganization: (organization) =>
        set((state) => ({
          organization,
          audit: [auditEntry('Cập nhật hồ sơ tổ chức', organization.name), ...state.audit],
        })),
      updateReport: (id, status) =>
        set((state) => {
          const report = state.reports.find((item) => item.id === id);
          return {
            reports: state.reports.map((item) => (item.id === id ? { ...item, status } : item)),
            audit: report
              ? [
                  auditEntry(`Cập nhật báo cáo sang ${status}`, report.opportunityTitle),
                  ...state.audit,
                ]
              : state.audit,
          };
        }),
      updateUserStatus: (id, status) =>
        set((state) => {
          const user = state.users.find((item) => item.id === id);
          return {
            users: state.users.map((item) => (item.id === id ? { ...item, status } : item)),
            audit: user
              ? [
                  auditEntry(
                    status === 'SUSPENDED' ? 'Tạm khóa người dùng' : 'Mở khóa người dùng',
                    user.email,
                    status === 'SUSPENDED' ? 'WARNING' : 'INFO',
                  ),
                  ...state.audit,
                ]
              : state.audit,
          };
        }),
      updateUserRole: (id, role) =>
        set((state) => {
          const user = state.users.find((item) => item.id === id);
          return {
            users: state.users.map((item) => (item.id === id ? { ...item, role } : item)),
            audit: user
              ? [auditEntry(`Cập nhật vai trò thành ${role}`, user.email), ...state.audit]
              : state.audit,
          };
        }),
      toggleCategory: (id) =>
        set((state) => {
          const category = state.categories.find((item) => item.id === id);
          return {
            categories: state.categories.map((item) =>
              item.id === id ? { ...item, active: !item.active } : item,
            ),
            audit: category
              ? [
                  auditEntry(
                    category.active ? 'Tắt danh mục' : 'Bật danh mục',
                    category.label,
                    'WARNING',
                  ),
                  ...state.audit,
                ]
              : state.audit,
          };
        }),
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
          audit: [auditEntry('Thêm danh mục', category.label), ...state.audit],
        })),
    }),
    { name: 'soh-operations-v1', version: 1 },
  ),
);
