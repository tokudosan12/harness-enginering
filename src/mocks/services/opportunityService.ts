import { mockOpportunities } from '@/mocks/data/opportunities';
import { useOperationsStore } from '@/stores/operationsStore';
import type { OrganizationProfile, PartnerPost } from '@/shared/types/operations';
import type { Opportunity, OpportunityFilters } from '@/shared/types/opportunity';

const delay = (ms = 420) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

function partnerPostToOpportunity(
  post: PartnerPost,
  organization: OrganizationProfile,
): Opportunity {
  return {
    id: post.id,
    slug: post.id,
    title: post.title,
    summary: post.summary,
    description: post.description,
    category: post.category,
    organization: {
      id: 'partner-org',
      name: organization.name,
      isVerified: organization.verified,
    },
    coverImage: mockOpportunities.find((item) => item.category === post.category)?.coverImage,
    fields: [],
    skills: [],
    tags: [],
    targetAudience: ['Sinh viên đại học'],
    requirements: [],
    benefits: [],
    applicationMethod: 'Liên hệ đơn vị tổ chức để hoàn thành hồ sơ đăng ký.',
    applicationUrl: organization.website,
    sourceUrl: organization.website,
    contactEmail: organization.email,
    contactPhone: organization.phone,
    participationMode: post.mode,
    location: post.location,
    publishedAt: post.updatedAt,
    applicationDeadline: post.deadline,
    status: post.status,
    isFeatured: false,
    isPublic: true,
    viewCount: post.views,
    saveCount: post.saves,
    createdAt: post.updatedAt,
    updatedAt: post.updatedAt,
  };
}

// Approved (`OPEN`) partner posts live in a separate store from the seeded
// mock catalog; merge them in here so moderation approvals actually reach
// the student-facing feed instead of only updating the partner's own record.
function getOpportunityPool(): Opportunity[] {
  const { posts, organization } = useOperationsStore.getState();
  const publishedPartnerPosts = posts
    .filter((post) => post.status === 'OPEN')
    .map((post) => partnerPostToOpportunity(post, organization));
  return [...mockOpportunities, ...publishedPartnerPosts];
}

function isOpenAndPublic(opportunity: Opportunity): boolean {
  return (
    opportunity.isPublic &&
    opportunity.status === 'OPEN' &&
    new Date(opportunity.applicationDeadline).getTime() >= Date.now()
  );
}

export async function getPublicOpportunities(
  filters: OpportunityFilters = {},
): Promise<Opportunity[]> {
  await delay();
  const search = filters.search?.trim().toLocaleLowerCase('vi');
  const categories = new Set(filters.categories ?? []);
  const modes = new Set(filters.modes ?? []);
  const fields = new Set(filters.fields ?? []);
  const skills = new Set(filters.skills ?? []);
  const locations = new Set(filters.locations ?? []);
  const audiences = new Set(filters.audiences ?? []);
  const organizations = new Set(filters.organizations ?? []);
  const deadlineLimit = filters.deadlineDays
    ? Date.now() + filters.deadlineDays * 24 * 60 * 60 * 1000
    : null;

  const results = getOpportunityPool().filter((item) => {
    if (!isOpenAndPublic(item)) return false;
    const searchable = [
      item.title,
      item.summary,
      item.organization.name,
      ...item.fields,
      ...item.skills,
      ...item.tags,
    ]
      .join(' ')
      .toLocaleLowerCase('vi');
    if (search && !searchable.includes(search)) return false;
    if (categories.size > 0 && !categories.has(item.category)) return false;
    if (modes.size > 0 && !modes.has(item.participationMode)) return false;
    if (fields.size > 0 && !item.fields.some((value) => fields.has(value))) return false;
    if (skills.size > 0 && !item.skills.some((value) => skills.has(value))) return false;
    if (locations.size > 0 && (!item.location || !locations.has(item.location))) return false;
    if (audiences.size > 0 && !item.targetAudience.some((value) => audiences.has(value))) {
      return false;
    }
    if (organizations.size > 0 && !organizations.has(item.organization.name)) return false;
    if (deadlineLimit && new Date(item.applicationDeadline).getTime() > deadlineLimit) return false;
    return true;
  });

  return [...results].sort((a, b) => {
    if (filters.sort === 'deadline') {
      return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
    }
    if (filters.sort === 'relevance') {
      return Number(b.isFeatured) - Number(a.isFeatured) || b.saveCount - a.saveCount;
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  await delay(300);
  return getOpportunityPool().find((item) => item.id === id && item.isPublic) ?? null;
}

export async function getFeaturedOpportunities(): Promise<Opportunity[]> {
  const items = await getPublicOpportunities({ sort: 'relevance' });
  return items.filter((item) => item.isFeatured).slice(0, 4);
}

export async function getLatestOpportunities(): Promise<Opportunity[]> {
  return (await getPublicOpportunities({ sort: 'newest' })).slice(0, 4);
}

export async function getExpiringOpportunities(): Promise<Opportunity[]> {
  return (await getPublicOpportunities({ sort: 'deadline' })).slice(0, 4);
}
