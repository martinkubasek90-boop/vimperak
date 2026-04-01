export type AdminWorkflowStatus = "draft" | "review" | "ready" | "live";

export type AdminNewsItem = {
  id: string | number;
  title: string;
  summary: string;
  category: string;
  urgent: boolean;
  date: string;
  workflowStatus?: AdminWorkflowStatus;
  updatedAt?: string;
  updatedByEmail?: string;
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
  workflowStatus?: AdminWorkflowStatus;
  updatedAt?: string;
  updatedByEmail?: string;
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
  workflowStatus?: AdminWorkflowStatus;
  updatedAt?: string;
  updatedByEmail?: string;
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
  workflowStatus?: AdminWorkflowStatus;
  updatedAt?: string;
  updatedByEmail?: string;
};

export type AdminReportStatus = "přijato" | "v řešení" | "vyřešeno" | "zamítnuto";

export type AdminReportItem = {
  id: string | number;
  title: string;
  description: string;
  category: string;
  status: AdminReportStatus;
  date: string;
  updatedAt?: string;
  updatedByEmail?: string;
};

export type AdminAuditLogItem = {
  id: string;
  entityType: "news" | "event" | "poll" | "directory" | "report";
  entityId: string;
  action: "create" | "update" | "delete" | "workflow" | "status";
  summary: string;
  actorEmail?: string;
  createdAt: string;
};
