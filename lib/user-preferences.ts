export const HOME_SECTIONS = [
  "today",
  "quick",
  "favorites",
  "events",
  "news",
  "polls",
  "notifications",
] as const;

export type HomeSectionId = (typeof HOME_SECTIONS)[number];

export const NOTIFICATION_TOPICS = [
  { id: "doprava", label: "Doprava" },
  { id: "radnice", label: "Radnice" },
  { id: "kultura", label: "Kultura" },
  { id: "sport", label: "Sport" },
  { id: "krize", label: "Krizové info" },
  { id: "komunita", label: "Komunita" },
] as const;

export type NotificationTopicId = (typeof NOTIFICATION_TOPICS)[number]["id"];

export type HomePreferences = {
  sectionOrder: HomeSectionId[];
  hiddenSections: HomeSectionId[];
  favoriteContactIds: Array<string | number>;
  pinnedQuickLinks: string[];
  notificationTopics: NotificationTopicId[];
};

export const DEFAULT_HOME_PREFERENCES: HomePreferences = {
  sectionOrder: [...HOME_SECTIONS],
  hiddenSections: [],
  favoriteContactIds: [],
  pinnedQuickLinks: ["/kalendar", "/kontakty", "/mesto", "/zhlasit"],
  notificationTopics: ["radnice", "doprava", "krize"],
};

export function sanitizeHomePreferences(input?: Partial<HomePreferences> | null): HomePreferences {
  const sectionOrder = Array.isArray(input?.sectionOrder)
    ? input.sectionOrder.filter((item): item is HomeSectionId => HOME_SECTIONS.includes(item as HomeSectionId))
    : DEFAULT_HOME_PREFERENCES.sectionOrder;
  const hiddenSections = Array.isArray(input?.hiddenSections)
    ? input.hiddenSections.filter((item): item is HomeSectionId => HOME_SECTIONS.includes(item as HomeSectionId))
    : DEFAULT_HOME_PREFERENCES.hiddenSections;
  const favoriteContactIds = Array.isArray(input?.favoriteContactIds)
    ? input.favoriteContactIds.filter(Boolean)
    : DEFAULT_HOME_PREFERENCES.favoriteContactIds;
  const pinnedQuickLinks = Array.isArray(input?.pinnedQuickLinks)
    ? input.pinnedQuickLinks.filter(Boolean)
    : DEFAULT_HOME_PREFERENCES.pinnedQuickLinks;
  const notificationTopics = Array.isArray(input?.notificationTopics)
    ? input.notificationTopics.filter(
        (item): item is NotificationTopicId =>
          NOTIFICATION_TOPICS.some((topic) => topic.id === item),
      )
    : DEFAULT_HOME_PREFERENCES.notificationTopics;

  const finalOrder = [
    ...sectionOrder,
    ...HOME_SECTIONS.filter((section) => !sectionOrder.includes(section)),
  ];

  return {
    sectionOrder: finalOrder,
    hiddenSections,
    favoriteContactIds,
    pinnedQuickLinks,
    notificationTopics,
  };
}
