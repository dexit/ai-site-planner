
export interface SitemapPage {
  id: string;
  pageName: string;
  pageDescription: string;
}

export interface WireframeSection {
  id: string;
  sectionName: string;
  sectionPurpose: string;
}

export interface PageWireframe {
  pageId: string; // Corresponds to SitemapPage id
  pageName: string; // For easier reference
  sections: WireframeSection[];
  isLoading?: boolean; // For individual page wireframe loading state
}

export enum AppStep {
  DESCRIPTION_INPUT = 'DESCRIPTION_INPUT',
  SITEMAP_GENERATION_LOADING = 'SITEMAP_GENERATION_LOADING',
  SITEMAP_DISPLAY = 'SITEMAP_DISPLAY',
  WIREFRAME_GENERATION_LOADING = 'WIREFRAME_GENERATION_LOADING', // Overall phase
  WIREFRAME_DISPLAY = 'WIREFRAME_DISPLAY',
  ERROR = 'ERROR'
}

// For structured checklists like SEO
export interface ChecklistItem {
  id: string;
  text: string;
  details?: string; // Optional additional information
  subItems?: ChecklistItem[]; // For nesting
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
  isInitiallyExpanded?: boolean; // UI hint for ChecklistDisplay
}


export interface SavedSitePlan {
  companyDescription: string;
  sitemap: SitemapPage[] | null;
  pageWireframes: PageWireframe[] | null;
  temperature: number;
  progressMessage?: string | null;
  ldJsonSchema?: string | null; // Stores the LD+JSON as a string
  siteSuggestions?: string[] | null; // Array of suggestion strings
  goLiveChecklist?: string[] | null; // Array of checklist item strings
  webDevChecklist?: string[] | null; // Array of checklist item strings
}
