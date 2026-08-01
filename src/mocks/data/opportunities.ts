import type {
  Opportunity,
  OpportunityCategory,
  ParticipationMode,
} from '@/shared/types/opportunity';

interface OpportunitySeed {
  title: string;
  organization: string;
  fields: string[];
  skills: string[];
  location: string;
}

const seeds: Record<OpportunityCategory, OpportunitySeed[]> = {
  INTERNSHIP: [
    {
      title: 'Thực tập sinh Frontend Developer',
      organization: 'FPT Software',
      fields: ['Công nghệ thông tin'],
      skills: ['React', 'TypeScript', 'UI/UX'],
      location: 'Hà Nội',
    },
    {
      title: 'Thực tập sinh Business Analyst',
      organization: 'KMS Technology',
      fields: ['Kinh doanh', 'Công nghệ'],
      skills: ['Phân tích', 'Agile', 'Giao tiếp'],
      location: 'TP. Hồ Chí Minh',
    },
    {
      title: 'Thực tập sinh Data Analyst',
      organization: 'Got It Vietnam',
      fields: ['Dữ liệu'],
      skills: ['SQL', 'Python', 'Power BI'],
      location: 'Đà Nẵng',
    },
    {
      title: 'Thực tập sinh Marketing Sáng tạo',
      organization: 'VNG Campus',
      fields: ['Marketing'],
      skills: ['Nội dung', 'Nghiên cứu', 'Truyền thông'],
      location: 'TP. Hồ Chí Minh',
    },
  ],
  STARTUP_JOB: [
    {
      title: 'Junior Backend Developer tại startup',
      organization: 'MindX Ventures',
      fields: ['Công nghệ thông tin'],
      skills: ['Node.js', 'PostgreSQL', 'API'],
      location: 'Hà Nội',
    },
    {
      title: 'Product Designer cho nền tảng giáo dục',
      organization: 'EduLab',
      fields: ['Thiết kế'],
      skills: ['Figma', 'Nghiên cứu người dùng', 'Prototype'],
      location: 'TP. Hồ Chí Minh',
    },
    {
      title: 'Growth Executive cho startup xanh',
      organization: 'GreenPath',
      fields: ['Kinh doanh'],
      skills: ['Growth', 'Phân tích', 'Marketing'],
      location: 'Đà Nẵng',
    },
    {
      title: 'Cộng tác viên vận hành cộng đồng',
      organization: 'Campus Connect',
      fields: ['Vận hành'],
      skills: ['Sự kiện', 'Cộng đồng', 'Giao tiếp'],
      location: 'Toàn quốc',
    },
  ],
  INNOVATION_COMPETITION: [
    {
      title: 'Cuộc thi Đổi mới sáng tạo Sinh viên 2026',
      organization: 'Trung tâm Đổi mới Quốc gia',
      fields: ['Khởi nghiệp'],
      skills: ['Đổi mới', 'Thuyết trình', 'Nghiên cứu'],
      location: 'Hà Nội',
    },
    {
      title: 'Business Case Challenge 2026',
      organization: 'RMIT Vietnam',
      fields: ['Kinh doanh'],
      skills: ['Case study', 'Chiến lược', 'Làm việc nhóm'],
      location: 'TP. Hồ Chí Minh',
    },
    {
      title: 'GreenTech Student Challenge',
      organization: 'British Council Vietnam',
      fields: ['Môi trường'],
      skills: ['Bền vững', 'Thiết kế', 'Pitching'],
      location: 'Toàn quốc',
    },
    {
      title: 'Young Innovators for Education',
      organization: 'UNICEF Vietnam',
      fields: ['Giáo dục'],
      skills: ['Nghiên cứu', 'Tác động xã hội', 'Sáng tạo'],
      location: 'Hà Nội',
    },
  ],
  HACKATHON: [
    {
      title: 'FPT University AI Hackathon',
      organization: 'FPT University',
      fields: ['Trí tuệ nhân tạo'],
      skills: ['Python', 'AI/ML', 'Data Science'],
      location: 'Hà Nội',
    },
    {
      title: 'Vietnam AI Hackathon 2026',
      organization: 'AI4VN',
      fields: ['Trí tuệ nhân tạo'],
      skills: ['AI/ML', 'MLOps', 'Sáng tạo'],
      location: 'Toàn quốc',
    },
    {
      title: 'Fintech Innovation Hackathon',
      organization: 'Vietnam Fintech Club',
      fields: ['Tài chính'],
      skills: ['Blockchain', 'API', 'Product'],
      location: 'TP. Hồ Chí Minh',
    },
    {
      title: 'Smart City Code Sprint',
      organization: 'Danang Innovation Hub',
      fields: ['Đô thị thông minh'],
      skills: ['IoT', 'Mobile', 'Dữ liệu'],
      location: 'Đà Nẵng',
    },
  ],
  SCHOLARSHIP: [
    {
      title: 'Học bổng Tài năng Công nghệ',
      organization: 'Viettel Foundation',
      fields: ['Công nghệ thông tin'],
      skills: ['Học thuật', 'Lãnh đạo', 'Công nghệ'],
      location: 'Toàn quốc',
    },
    {
      title: 'Học bổng ASEAN Future Leaders 2026',
      organization: 'ASEAN Education Fund',
      fields: ['Lãnh đạo'],
      skills: ['Học thuật', 'Cộng đồng', 'Tiếng Anh'],
      location: 'Singapore',
    },
    {
      title: 'Học bổng Nữ sinh STEM',
      organization: 'Vietnam STEM Alliance',
      fields: ['Khoa học'],
      skills: ['STEM', 'Nghiên cứu', 'Lãnh đạo'],
      location: 'Toàn quốc',
    },
    {
      title: 'Học bổng Trao đổi Sakura',
      organization: 'Japan Student Services',
      fields: ['Giao lưu quốc tế'],
      skills: ['Tiếng Nhật', 'Học thuật', 'Thích nghi'],
      location: 'Nhật Bản',
    },
  ],
  INVESTMENT_FUND: [
    {
      title: 'Quỹ hỗ trợ dự án khởi nghiệp sinh viên',
      organization: 'SV Startup Fund',
      fields: ['Khởi nghiệp'],
      skills: ['Mô hình kinh doanh', 'Pitching', 'Tài chính'],
      location: 'Toàn quốc',
    },
    {
      title: 'Seed Grant cho sáng kiến cộng đồng',
      organization: 'Impact Hub Vietnam',
      fields: ['Tác động xã hội'],
      skills: ['Quản lý dự án', 'Cộng đồng', 'Đo lường'],
      location: 'Hà Nội',
    },
    {
      title: 'Quỹ thử nghiệm sản phẩm công nghệ',
      organization: 'TechSeed Vietnam',
      fields: ['Công nghệ'],
      skills: ['MVP', 'Sản phẩm', 'Tăng trưởng'],
      location: 'TP. Hồ Chí Minh',
    },
    {
      title: 'Climate Innovation Microfund',
      organization: 'Green Innovation Network',
      fields: ['Môi trường'],
      skills: ['Bền vững', 'Tài chính', 'Nghiên cứu'],
      location: 'Toàn quốc',
    },
  ],
  INCUBATION_PROGRAM: [
    {
      title: 'Chương trình Ươm tạo Startup Campus',
      organization: 'BK Holdings',
      fields: ['Khởi nghiệp'],
      skills: ['Startup', 'Kinh doanh', 'Gọi vốn'],
      location: 'Hà Nội',
    },
    {
      title: 'INNOVATE Student Founder Program',
      organization: 'Saigon Innovation Hub',
      fields: ['Khởi nghiệp'],
      skills: ['Sản phẩm', 'Mentoring', 'Thuyết trình'],
      location: 'TP. Hồ Chí Minh',
    },
    {
      title: 'Ươm tạo dự án công nghệ giáo dục',
      organization: 'EdTech Vietnam',
      fields: ['Giáo dục'],
      skills: ['EdTech', 'Nghiên cứu', 'MVP'],
      location: 'Toàn quốc',
    },
    {
      title: 'Blue Ocean Incubation Program',
      organization: 'Danang Startup Council',
      fields: ['Khởi nghiệp'],
      skills: ['Thị trường', 'Chiến lược', 'Gọi vốn'],
      location: 'Đà Nẵng',
    },
  ],
};

const covers: Record<OpportunityCategory, string> = {
  INTERNSHIP:
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  STARTUP_JOB:
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80',
  INNOVATION_COMPETITION:
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80',
  HACKATHON:
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
  SCHOLARSHIP:
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
  INVESTMENT_FUND:
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
  INCUBATION_PROGRAM:
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
};

function addDays(iso: string, days: number): string {
  const value = new Date(iso);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString();
}

const baseDate = '2026-08-01T08:00:00.000Z';
const modes: ParticipationMode[] = ['ONLINE', 'OFFLINE', 'HYBRID'];

export const mockOpportunities: Opportunity[] = Object.entries(seeds).flatMap(
  ([category, categorySeeds], categoryIndex) =>
    categorySeeds.map((seed, itemIndex) => {
      const index = categoryIndex * 4 + itemIndex;
      const isHistorical = itemIndex === 3;
      const status = isHistorical ? (categoryIndex % 2 === 0 ? 'EXPIRED' : 'CLOSED') : 'OPEN';
      const deadlineOffsets = [
        5 + categoryIndex,
        20 + categoryIndex * 2,
        55 + categoryIndex * 3,
        -8,
      ];
      const publishedAt = addDays(baseDate, -(3 + index));
      const id = `opp-${String(index + 1).padStart(2, '0')}`;
      return {
        id,
        slug: seed.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        title: seed.title,
        summary: `Cơ hội dành cho sinh viên muốn phát triển ${seed.skills.slice(0, 2).join(' và ')} trong môi trường thực tế.`,
        description: `Chương trình mang đến trải nghiệm thực tế, cố vấn chuyên môn và cơ hội kết nối cùng cộng đồng. Thông tin được chuẩn hóa từ nguồn chính thức của ${seed.organization}.`,
        category: category as OpportunityCategory,
        organization: { id: `org-${categoryIndex + 1}`, name: seed.organization, isVerified: true },
        coverImage: covers[category as OpportunityCategory],
        fields: seed.fields,
        skills: seed.skills,
        tags: [...seed.skills.slice(0, 2), 'Sinh viên'],
        targetAudience: ['Sinh viên đại học', 'Sinh viên năm 2–4'],
        requirements: [
          'Có tinh thần chủ động và cam kết tham gia đầy đủ',
          `Quan tâm đến ${seed.fields[0] ?? 'lĩnh vực liên quan'}`,
          'Hoàn thành hồ sơ theo hướng dẫn của đơn vị tổ chức',
        ],
        benefits: [
          'Được cố vấn bởi chuyên gia',
          'Mở rộng mạng lưới nghề nghiệp',
          'Nhận chứng nhận khi hoàn thành',
        ],
        applicationMethod: 'Hoàn thành biểu mẫu tại trang chính thức của đơn vị tổ chức.',
        applicationUrl: `https://example.com/apply/${id}`,
        sourceUrl: `https://example.com/source/${id}`,
        contactEmail: `opportunity${index + 1}@example.com`,
        participationMode: modes[index % modes.length] ?? 'ONLINE',
        location: seed.location,
        publishedAt,
        applicationDeadline: addDays(baseDate, deadlineOffsets[itemIndex] ?? 30),
        eventStartAt: addDays(baseDate, (deadlineOffsets[itemIndex] ?? 30) + 7),
        eventEndAt: addDays(baseDate, (deadlineOffsets[itemIndex] ?? 30) + 9),
        status,
        isFeatured: itemIndex === 0,
        isPublic: true,
        viewCount: 320 + index * 47,
        saveCount: 48 + index * 9,
        createdAt: publishedAt,
        updatedAt: addDays(publishedAt, 1),
      } satisfies Opportunity;
    }),
);
