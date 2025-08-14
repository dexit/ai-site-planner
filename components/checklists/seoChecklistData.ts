
import { ChecklistSection } from '../../types';

export const seoChecklistData: ChecklistSection[] = [
  {
    id: 'seo-site-optimization',
    title: 'Site Optimization (On-Page SEO Elements)',
    isInitiallyExpanded: true,
    items: [
      {
        id: 'so-keywords',
        text: 'Keywords Optimization',
        subItems: [
          { id: 'so-kw-tips', text: 'Google Keyword Tips: Research and integrate relevant keywords.' },
          { id: 'so-kw-planner', text: 'Adwords Keyword Planner: Utilize for keyword discovery and volume.' },
          { id: 'so-kw-longtail', text: 'Long Tail Keywords: Target specific, longer phrases.' },
        ],
      },
      {
        id: 'so-content',
        text: 'Content Optimization',
        subItems: [
          { id: 'so-co-types', text: 'Content Types: Diversify (blog posts, articles, videos, infographics).' },
          { id: 'so-co-structure', text: 'Content Structure: Use headings (H1-H6), paragraphs, lists for readability.' },
          { id: 'so-co-angle', text: 'Content Angle: Ensure fresh, unique perspectives or value.' },
          { id: 'so-co-remove-duplicate', text: 'Remove Duplicate Content: Check and resolve duplicate content issues across the site.' },
        ],
      },
      { id: 'so-title-tags', text: 'Optimize Title Tags: Concise, keyword-rich, and unique for each page.' },
      { id: 'so-meta-information', text: 'Meta Information: Write compelling meta descriptions for each page.' },
      { id: 'so-urls', text: 'Structure Your URLs: Clean, simple, readable, and SEO-friendly URLs.' },
      { id: 'so-navigation', text: 'Optimize Your Navigation Menu: Clear, logical, and indexable menu items.' },
      { id: 'so-images', text: 'Optimize Your Images: Use descriptive alt text, compress images for speed.' },
      { id: 'so-internal-links', text: 'Internal Link Optimization: Link relevant pages within your site.' },
      { id: 'so-structured-data', text: 'Use Structured Data Markup (Schema): Implement relevant schema to improve search appearance.' },
    ],
  },
  {
    id: 'seo-technical-optimization',
    title: 'Technical Optimization',
    items: [
      { id: 'to-site-structure', text: 'Site Page Structure: Logical hierarchy and organization.' },
      { id: 'to-ux', text: 'UX User Experience: Improve dwell time through intuitive design and valuable content.' },
      { id: 'to-mobile', text: 'Mobile Adaptation & Mobile-Friendly Website: Ensure responsive design, Google ranks mobile-first sites higher.' },
      { id: 'to-usability', text: 'Usability: Easy to navigate and use for all visitors.' },
      { id: 'to-loading-speed', text: 'Loading Speed: Optimize for fast page load times.' },
      { id: 'to-page-indexing', text: 'Page Indexing: Ensure important pages are crawlable and indexable.' },
      { id: 'to-canonical', text: 'Canonical (Unique URL): Use canonical tags to prevent duplicate content issues.' },
      { id: 'to-duplicate-detection', text: 'Duplicate Content Detection: Regularly check and resolve.' },
      { id: 'to-404', text: 'Percentage of 404 Error Pages: Monitor and minimize 404 errors, create custom 404 page.' },
      { id: 'to-redirects', text: 'Setup 301 Redirects: Use for permanently moved content to pass link equity.' },
      { id: 'to-sitemap-xml', text: 'Pay Attention To XML Sitemap: Create and submit an accurate XML sitemap to search engines.' },
      { id: 'to-robots-txt', text: 'Robots.txt: Configure correctly to guide web crawlers.' },
    ],
  },
  {
    id: 'seo-off-site-optimization',
    title: 'Off-site Optimization',
    items: [
      {
        id: 'os-backlinks',
        text: 'Backlinks (Build Quality Backlinks)',
        subItems: [
          { id: 'os-bl-community', text: 'Community Promotion: Engage in relevant communities.' },
          { id: 'os-bl-social', text: 'Social Networking Sites: Share content and engage.' },
          { id: 'os-bl-links', text: 'Links: Acquire from high-authority, relevant websites.' },
        ],
      },
      { id: 'os-website-authority', text: 'Website Authority: Build overall domain and page authority.' },
      { id: 'os-competitor-analysis', text: 'Competitor Analysis: Analyze competitor backlink profiles and strategies.' },
    ],
  },
  {
    id: 'seo-monitoring-tracking',
    title: 'Monitoring and Tracking (All Things Google)',
    items: [
      {
        id: 'mt-ga',
        text: 'Google Analytics (GA) - Setup Google Analytics',
        subItems: [
          { id: 'mt-ga-pageviews', text: 'Pageviews: Track views for each page.' },
          { id: 'mt-ga-bounce', text: 'Bounce Rate: Monitor and aim to reduce.' },
          { id: 'mt-ga-dwell', text: 'Dwell Time: Analyze how long users stay on pages.' },
          { id: 'mt-ga-keywords', text: 'Search Keywords: See what terms users search for on your site (if site search is enabled).' },
          { id: 'mt-ga-popular', text: 'Most Popular Pages: Identify top-performing content.' },
          { id: 'mt-ga-exited', text: 'Most Exited Pages: Understand where users leave your site.' },
        ],
      },
      { id: 'mt-gsc', text: 'Google Search Console (GSC) - Setup Google Webmasters: Track site search performance, indexing status, and errors.' },
      { id: 'mt-gmb', text: 'Provide Accurate Data on Your Google Listing (Google Business Profile): Detailed GMB helps users choose your business.' },
      { id: 'mt-gmb-categories', text: 'Select Business Categories Carefully (GMB): Pick right main & additional categories for GMB.' },
    ],
  },
   {
    id: 'seo-local-citations',
    title: 'Local SEO & Citations (Top Business Directories)',
    items: [
      { id: 'lc-location-data', text: 'Feature Complete Location Data: Have a Contact Us page with NAP (Name, Address, Phone) for all locations.' },
      { id: 'lc-bing', text: 'Create/Claim Bing Listing: Earn more leads via Bing Places.' },
      { id: 'lc-social', text: 'Get On Social Platforms: Identify where customers are and be visible.' },
      { id: 'lc-yelp', text: 'Create/Claim Yelp Listing: Yelp is key for discovery and reviews.' },
      { id: 'lc-other-directories', text: 'Create/Claim listings on other relevant directories.' },
      {
        id: 'lc-build-citations',
        text: 'Build Citations',
        subItems: [
          { id: 'lc-bc-top50', text: 'Submit citations to top 50 sites (relevant to your industry/location).' },
          { id: 'lc-bc-competitors', text: 'Check competitors\' citations and get listed there too.' },
        ],
      },
    ],
  },
  {
    id: 'seo-reviews-testimonials',
    title: 'Customer Reviews & Testimonials',
    items: [
      { id: 'rt-monitor-respond', text: 'Monitor and respond to reviews regularly: Build customer relationships.' },
      { id: 'rt-add-testimonials', text: 'Add recognizable testimonials: Display reviews from existing customers to build credibility.' },
      { id: 'rt-generate-more', text: 'Look to generate more (positive) reviews: Improve overall rating.' },
    ],
  },
  {
    id: 'seo-resource-tools',
    title: 'Resource Tools',
    items: [
      { id: 'rt-resources', text: 'Resources: Utilize various SEO blogs, forums, and guides.' },
      { id: 'rt-tools', text: 'Tools: Use SEO tools for analysis and tracking (e.g., Chrome SEO Extensions, Ahrefs, SEMrush, Moz).' },
    ],
  },
];
