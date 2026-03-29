export type AdminNewsItem = {
  id: string | number;
  title: string;
  summary: string;
  category: string;
  urgent: boolean;
  date: string;
};

export type AdminEventItem = {
  id: string | number;
  title: string;
  date: string;
  time: string;
  place: string;
  category: string;
  free: boolean;
  price: string;
};

export type AdminDirectoryItem = {
  id: string | number;
  name: string;
  category: string;
  cityDepartment?: string;
  phone: string;
  address: string;
  hours?: string;
  note?: string;
  email?: string;
  website?: string;
  sourceUrl?: string;
  appointmentUrl?: string;
  appointmentLabel?: string;
  sourceKind?: "manual" | "vimperk_web" | "import";
  sourceExternalId?: string;
  sourceSyncedAt?: string;
  isLocked?: boolean;
};

export type AdminPollOption = {
  id: string | number;
  text: string;
  votes: number;
};

export type AdminPollItem = {
  id: string | number;
  question: string;
  category: string;
  endsAt: string;
  totalVotes: number;
  options: AdminPollOption[];
};

export type AdminReportStatus = "přijato" | "v řešení" | "vyřešeno" | "zamítnuto";

export type AdminReportItem = {
  id: string | number;
  title: string;
  description: string;
  category: string;
  status: AdminReportStatus;
  date: string;
};
