export type AdminRole =
  | "viewer"
  | "editor"
  | "dispatcher"
  | "approver"
  | "superadmin";

export type AdminSection =
  | "přehled"
  | "zpravodaj"
  | "akce"
  | "ankety"
  | "kontakty"
  | "závady";

type RoleConfig = {
  label: string;
  description: string;
  sections: AdminSection[];
  canCreateNews: boolean;
  canCreateEvents: boolean;
  canManagePolls: boolean;
  canManageDirectory: boolean;
  canResolveReports: boolean;
  canPublishUrgent: boolean;
  canManageAccess: boolean;
};

const ROLE_ORDER: AdminRole[] = [
  "superadmin",
  "approver",
  "dispatcher",
  "editor",
  "viewer",
];

const ROLE_CONFIG: Record<AdminRole, RoleConfig> = {
  viewer: {
    label: "Náhled",
    description: "Jen čtení přehledu a kontrola stavu obsahu.",
    sections: ["přehled"],
    canCreateNews: false,
    canCreateEvents: false,
    canManagePolls: false,
    canManageDirectory: false,
    canResolveReports: false,
    canPublishUrgent: false,
    canManageAccess: false,
  },
  editor: {
    label: "Redaktor",
    description: "Správa zpravodaje a kalendáře akcí.",
    sections: ["přehled", "zpravodaj", "akce", "ankety", "kontakty"],
    canCreateNews: true,
    canCreateEvents: true,
    canManagePolls: true,
    canManageDirectory: true,
    canResolveReports: false,
    canPublishUrgent: false,
    canManageAccess: false,
  },
  dispatcher: {
    label: "Dispečer",
    description: "Přebírání a vyřizování hlášení od občanů.",
    sections: ["přehled", "závady"],
    canCreateNews: false,
    canCreateEvents: false,
    canManagePolls: false,
    canManageDirectory: false,
    canResolveReports: true,
    canPublishUrgent: false,
    canManageAccess: false,
  },
  approver: {
    label: "Schvalovatel",
    description: "Publikace obsahu a schvalování urgentních sdělení.",
    sections: ["přehled", "zpravodaj", "akce", "ankety", "kontakty", "závady"],
    canCreateNews: true,
    canCreateEvents: true,
    canManagePolls: true,
    canManageDirectory: true,
    canResolveReports: true,
    canPublishUrgent: true,
    canManageAccess: false,
  },
  superadmin: {
    label: "Superadmin",
    description: "Technická správa, role a krizové zásahy.",
    sections: ["přehled", "zpravodaj", "akce", "ankety", "kontakty", "závady"],
    canCreateNews: true,
    canCreateEvents: true,
    canManagePolls: true,
    canManageDirectory: true,
    canResolveReports: true,
    canPublishUrgent: true,
    canManageAccess: true,
  },
};

function parseEmails(value?: string) {
  if (!value) return [];
  return value
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function getRoleEmails(role: AdminRole) {
  switch (role) {
    case "superadmin":
      return parseEmails(process.env.ADMIN_SUPERADMIN_EMAILS);
    case "approver":
      return parseEmails(process.env.ADMIN_APPROVER_EMAILS);
    case "dispatcher":
      return parseEmails(process.env.ADMIN_DISPATCHER_EMAILS);
    case "editor":
      return parseEmails(process.env.ADMIN_EDITOR_EMAILS);
    case "viewer":
      return parseEmails(process.env.ADMIN_VIEWER_EMAILS);
  }
}

export function getAdminRole(email?: string | null): AdminRole | null {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) return null;

  for (const role of ROLE_ORDER) {
    if (getRoleEmails(role).includes(normalizedEmail)) {
      return role;
    }
  }

  return null;
}

export function getRoleConfig(role: AdminRole): RoleConfig {
  return ROLE_CONFIG[role];
}

export function getAdminAccess(email?: string | null) {
  const role = getAdminRole(email);

  if (!role) {
    return {
      role: null,
      allowed: false,
      permissions: null,
    };
  }

  return {
    role,
    allowed: true,
    permissions: getRoleConfig(role),
  };
}
