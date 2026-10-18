export interface HireResumeDependent {
  name: string;
  relation: string;
}

export interface HireResumeEducation {
  start: string;
  end: string;
  place: string;
  major: string;
  licence: string;
}

export interface HireResumeLanguage {
  language: string;
  read: string;
  write: string;
  speak: string;
}

export interface HireResumeWorkExperience {
  start: string;
  end: string;
  place: string;
  job: string;
  salary: string;
  leave_reasone: string;
}

export interface HireResumeCloseContact {
  name: string;
  number: string;
  address: string;
}

export type HireResumeDutyStatus =
  | "served"
  | "not_served"
  | "exempt"
  | (string & {});

export interface HireResume {
  id: number;

  // Personal information
  image: string | null;
  first_name: string;
  last_name: string;
  father_name: string;
  national_code: string;
  place_of_issue: string;
  date_of_birth: string;
  religion: string;
  mazhab: string;
  married: boolean | null;
  children: string | null;
  dependents: HireResumeDependent[] | null;

  // Contact information
  province: string;
  city: string;
  address: string;
  email: string;
  phone_number: string;

  // Education
  education: HireResumeEducation[] | null;
  research: string | null;

  // Languages
  languages: HireResumeLanguage[] | null;

  // Work experience
  work_experience: HireResumeWorkExperience[] | null;

  // Employment information
  duty_status: HireResumeDutyStatus;
  off_duty_reason: string | null;
  criminal_conviction: boolean | null;
  physical_health: string | null;
  grantee: boolean | null;
  job_interest: string;
  introducer: string | null;
  start_work: string | null;
  ask_last_boss: boolean | null;
  last_boss_name: string | null;
  last_boss_address: string | null;
  last_boss_phone_number: string | null;
  salary_request: string | null;
  another_job: boolean | null;
  extra: string | null;

  // Close contacts
  close_people_contact: HireResumeCloseContact[] | null;
}

export type HireResumeSort = "newest" | "oldest";

export type HireResumeWorkFilter = "all" | "hasWork" | "noWork";

export interface HireResumeFiltersState {
  search: string;
  province: string;
  city: string;
  jobInterest: string;
  dutyStatus: string;
  workExperience: HireResumeWorkFilter;
  sort: HireResumeSort;
}

export const initialHireResumeFilters: HireResumeFiltersState = {
  search: "",
  province: "",
  city: "",
  jobInterest: "",
  dutyStatus: "",
  workExperience: "all",
  sort: "newest",
};
