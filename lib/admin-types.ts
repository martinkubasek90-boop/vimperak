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

export type AdminReportStatus = "přijato" | "v řešení" | "vyřešeno" | "zamítnuto";

export type AdminReportItem = {
  id: string | number;
  title: string;
  description: string;
  category: string;
  status: AdminReportStatus;
  date: string;
};
