
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
  SITEMAP_DISPLAY = 'SITEMAP_DISPLAY', // Sitemap ready, wireframes might be next or loading
  WIREFRAME_GENERATION_LOADING = 'WIREFRAME_GENERATION_LOADING', 
  ENHANCEMENTS_DISPLAY = 'ENHANCEMENTS_DISPLAY', // All core generation done, enhancements section is active.
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
  id:string;
  title: string;
  items: ChecklistItem[];
  isInitiallyExpanded?: boolean; // UI hint for ChecklistDisplay
}

export interface SerpPreviewContent {
  title: string;
  description: string;
  url: string; // Typically the homepage URL or a representative one
}

export interface SeoStrategyInsight {
  id: string;
  title: string;
  explanation: string;
  actionableTips?: string[];
}

export interface SavedSitePlan {
  companyDescription: string;
  sitemap: SitemapPage[] | null;
  pageWireframes: PageWireframe[] | null;
  temperature: number;
  progressMessage?: string | null;
  ldJsonSchema?: Array<Record<string, any>> | null; // Updated: Can be an array of schema objects
  siteSuggestions?: string[] | null; 
  goLiveChecklist?: string[] | null; 
  webDevChecklist?: string[] | null; 
  serpPreview?: SerpPreviewContent | null;
  seoStrategy?: SeoStrategyInsight[] | null;
}
