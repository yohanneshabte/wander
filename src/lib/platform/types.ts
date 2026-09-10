export type SiteTheme = "cream" | "lab";

export type ServiceKind =
  | "resource"
  | "appointment"
  | "addon"
  | "package"
  | "membership"
  | "group";

export type Resource = {
  id: string;
  siteId: string;
  name: string;
  short: string;
  blurb: string;
  kind: string;
  amenities: string[];
  capacity: number;
  sort: number;
};

export type Category = {
  id: string;
  siteId: string;
  key: string;
  name: string;
  blurb: string;
  sort: number;
};

export type Service = {
  id: string;
  siteId: string;
  categoryKey: string;
  name: string;
  durationMin: number;
  blurb: string;
  weekdayPrice: number | null;
  weekendPrice: number | null;
  eveningPrice: number | null;
  listPrice: number | null;
  perPerson: boolean;
  kind: ServiceKind;
  source: string;
  sort: number;
};

export type Membership = {
  id: string;
  siteId: string;
  name: string;
  priceMonth: number;
  blurb: string;
  credits: string;
  sort: number;
};

export type Site = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  city: string;
  address: string;
  phone: string;
  website: string;
  hoursNote: string;
  openMin: number;
  closeMin: number;
  dayCutoffMin: number;
  bufferMin: number;
  maxConcurrent: number;
  theme: SiteTheme;
  bookingNote: string;
  pitch: string;
};

export type PlatformSettings = {
  liveSiteId: string;
  previewSiteId: string | null;
  demoMode: boolean;
  discoveryMode: boolean;
  houseVoice: boolean;
  directoryUnlocked: boolean;
};

export type HouseCatalog = {
  site: Site;
  resources: Resource[];
  categories: Category[];
  services: Service[];
  memberships: Membership[];
};

export type ProfitInputs = {
  sessionsPerDay: number;
  avgTicket: number;
  occupancy: number;
  costs: number;
  members: number;
  avgDues: number;
  noShowPct: number;
};
