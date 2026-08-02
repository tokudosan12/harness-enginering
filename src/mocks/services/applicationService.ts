import type { OpportunityApplication } from '@/shared/types/opportunity';

const delay = (ms = 900) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export interface ApplicationInput {
  opportunityId: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  cvFile: File;
}

export async function submitOpportunityApplication(
  input: ApplicationInput,
): Promise<OpportunityApplication> {
  await delay();
  return {
    id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    opportunityId: input.opportunityId,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    university: input.university,
    major: input.major,
    cvFileName: input.cvFile.name,
    cvFileSize: input.cvFile.size,
    submittedAt: new Date().toISOString(),
  };
}
