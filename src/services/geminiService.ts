
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SitemapPage, WireframeSection, SerpPreviewContent, SeoStrategyInsight } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  console.warn("VITE_API_KEY environment variable not set in .env file. AI features will not work. See README.md for setup.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const modelName = 'gemini-2.5-flash-preview-04-17';

const parseJsonFromResponse = <T,>(responseText: string, defaultValue: T): T => {
  let stringToParse = responseText.trim();
  const fenceRegex = /```(\w*)?\s*\n?([\s\S]*?)\n?\s*```/;
  const fenceMatch = stringToParse.match(fenceRegex);

  if (fenceMatch && fenceMatch[2]) {
    stringToParse = fenceMatch[2].trim();
  }

  const cleaningRegex = /(:\s*"[^"\\]*(?:\\.[^"\\]*)*")\s*([^,}\[\]]+?)\s*(?=[,}\]])/g;
  const cleanedOnce = stringToParse.replace(cleaningRegex, (match, valuePart, garbagePart) => {
    console.warn(`Attempting to clean suspicious text: '${garbagePart}' after value part: '${valuePart.substring(0,50)}...'`);
    return valuePart; 
  });

  if (cleanedOnce !== stringToParse) {
    console.log("Applied pre-cleaning to JSON string.");
    stringToParse = cleanedOnce;
  }

  try {
    return JSON.parse(stringToParse) as T;
  } catch (error) {
    console.error(
      "Failed to parse JSON response. Raw string attempted for parsing:", `"${stringToParse}"`,
      "Original responseText:", `"${responseText}"`,
      "Error:", error
    );
    
    if (stringToParse.startsWith("{") && stringToParse.endsWith("}") && Array.isArray(defaultValue)) {
        try {
            const singleObject = JSON.parse(stringToParse);
            // Add checks for other single object types if necessary
            if (('pageName' in singleObject && 'pageDescription' in singleObject) || 
                ('sectionName' in singleObject && 'sectionPurpose' in singleObject) ||
                ('title' in singleObject && 'description' in singleObject && 'url' in singleObject) || // For SERP
                ('title' in singleObject && 'explanation' in singleObject) // For SEO Strategy
                ) {
                console.log("Attempting recovery by wrapping single parsed object in an array.");
                return [singleObject] as unknown as T;
            }
        } catch (recoveryJsonError) {
            console.error("Single object recovery attempt failed:", recoveryJsonError);
        }
    }
    return defaultValue;
  }
};


export const generateSitemap = async (description: string, temperature: number): Promise<SitemapPage[]> => {
  if (!API_KEY) throw new Error("API_KEY not configured. Check VITE_API_KEY in your .env file.");
  try {
    const systemInstruction = `You are an expert website planner. Your goal is to generate a structured sitemap based on a user's company/website description.
    The sitemap should include essential pages relevant to this type of website. For each page, provide a 'pageName' (e.g., 'Homepage', 'About Us', 'Services', 'Contact') and a concise 'pageDescription' (1-2 sentences) of its purpose.
    Return the sitemap as a JSON array of objects, where each object has 'pageName' (string) and 'pageDescription' (string) keys.
    Ensure the page names are user-friendly and conventional for website navigation.
    Example: [{"pageName": "Homepage", "pageDescription": "The main landing page introducing the company and its value proposition."}, {"pageName": "About Us", "pageDescription": "Details about the company's mission, vision, and team."}]`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: `Generate a sitemap for a website described as: "${description}".`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: temperature,
      },
    });

    const rawSitemap = parseJsonFromResponse<Array<{pageName: string, pageDescription: string}>>(response.text, []);
    return rawSitemap.map((page, index) => ({
      ...page,
      id: `sitemap-page-${Date.now()}-${index}`,
    }));
  } catch (error) {
    console.error("Error generating sitemap:", error);
    throw new Error(`Failed to generate sitemap. ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const generateWireframesForPage = async (pageName: string, pageDescription: string, companyDescription: string, temperature: number): Promise<WireframeSection[]> => {
  if (!API_KEY) throw new Error("API_KEY not configured. Check VITE_API_KEY in your .env file.");
  try {
    const systemInstruction = `You are an expert UI/UX designer. Your task is to outline the key sections for a webpage based on its purpose and the overall website context.
    For each section, provide a 'sectionName' (e.g., 'Hero Banner', 'Key Features', 'Testimonials', 'Call to Action') and a brief 'sectionPurpose' (e.g., 'Grab attention and state value proposition', 'Highlight product benefits', 'Build trust with social proof').
    Return this as a JSON array of objects, where each object has 'sectionName' (string) and 'sectionPurpose' (string) keys. Focus on a logical flow of information for the user. Provide 3 to 6 sections per page.
    Example: [{"sectionName": "Navigation Bar", "sectionPurpose": "Provide easy access to all major site pages."}, {"sectionName": "Hero Section", "sectionPurpose": "Introduce the page's main topic and value."}]`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: `For a page titled "${pageName}" with the description "${pageDescription}", which is part of a website for "${companyDescription}", generate a list of 3 to 6 typical sections or content blocks.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: temperature,
      },
    });
    
    const rawSections = parseJsonFromResponse<Array<{sectionName: string, sectionPurpose: string}>>(response.text, []);
    return rawSections.map((section, index) => ({
      ...section,
      id: `wf-section-${Date.now()}-${index}`,
    }));
  } catch (error) {
    console.error(`Error generating wireframe for page ${pageName}:`, error);
    throw new Error(`Failed to generate wireframe for ${pageName}. ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const generateLdJsonSchema = async (companyDescription: string, sitemap: SitemapPage[], temperature: number): Promise<Array<Record<string, any>>> => {
  if (!API_KEY) throw new Error("API_KEY not configured. Check VITE_API_KEY in your .env file.");
  try {
    const systemInstruction = `You are an expert SEO specialist. Your task is to generate a comprehensive set of LD+JSON schemas for a website.
    Based on the company description and sitemap, create an array of JSON-LD objects.
    This array should include:
    1.  A primary '@type': 'Organization' or '@type': 'LocalBusiness' schema. Include 'name', 'url' (use "https://example.com" as placeholder), 'description'. If LocalBusiness, add 'address' and 'telephone' with placeholders.
    2.  A '@type': 'WebSite' schema, including 'url' (placeholder) and a 'potentialAction' of '@type': 'SearchAction' if appropriate.
    3.  Individual '@type': 'WebPage' schemas for each page in the provided sitemap, including 'name', 'url' (e.g., "https://example.com/pagename"), and 'description'.
    4.  If any sitemap page suggests a blog post or news (e.g., "Blog", "News", "Article"), include an '@type': 'Article' schema for it.
    5.  If sitemap pages suggest specific types like "Services", "Products", "FAQ", "Courses", "Reviews", provide TEMPLATE schemas for '@type': 'Service', '@type': 'Product', '@type': 'FAQPage', '@type': 'Course', '@type': 'ReviewPage' respectively. These templates should include common properties with CLEAR PLACEHOLDER VALUES like "[[Placeholder for Service Name]]" or "[[Description of the product]]".
    Return ONLY the JSON array of these schema objects. Do NOT wrap it in <script> tags or markdown.
    Ensure all returned objects are valid JSON-LD.
    Example of a returned array element (Organization): {"@context":"https://schema.org","@type":"Organization","name":"Example Corp","url":"https://example.com","description":"A sample company description."}
    Example of a WebPage element: {"@context":"https://schema.org","@type":"WebPage","name":"About Us","url":"https://example.com/about-us","description":"Learn more about our company."}
    Example of a Product template: {"@context":"https://schema.org","@type":"Product","name":"[[Placeholder for Product Name]]","description":"[[Placeholder for Product Description]]","offers":{"@type":"Offer","price":"[[Placeholder Price]]","priceCurrency":"USD"}}`;
    
    const sitemapSummary = sitemap.map(p => ({ name: p.pageName, description: p.pageDescription }) );
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: `Generate an array of LD+JSON schema objects for a website. Company description: "${companyDescription}". Sitemap pages: ${JSON.stringify(sitemapSummary)}.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json", 
        temperature: temperature,
      },
    });

    return parseJsonFromResponse<Array<Record<string, any>>>(response.text, []);
  } catch (error) {
    console.error("Error generating LD+JSON schema array:", error);
    throw new Error(`Failed to generate LD+JSON schema array. ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const generateSiteSuggestions = async (companyDescription: string, sitemap: SitemapPage[], temperature: number): Promise<string[]> => {
  if (!API_KEY) throw new Error("API_KEY not configured. Check VITE_API_KEY in your .env file.");
  try {
    const systemInstruction = `You are an expert web strategist and UX consultant.
    Based on the company description and sitemap, provide a list of 3-5 actionable suggestions or enhancements for the website.
    These could relate to content, features, UX, or calls to action. Keep each suggestion concise (1-2 sentences).
    Return the suggestions as a JSON array of strings.
    Example: ["Consider adding a blog section to share industry news.", "Implement a clear call-to-action on the homepage for newsletter sign-ups."]`;
    
    const sitemapSummary = sitemap.map(p => p.pageName).join(', ');
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: `Provide site suggestions for a website. Company: "${companyDescription}". Sitemap: ${sitemapSummary}.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: temperature,
      },
    });
    return parseJsonFromResponse<string[]>(response.text, []);
  } catch (error) {
    console.error("Error generating site suggestions:", error);
    throw new Error(`Failed to generate site suggestions. ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const generateChecklist = async (checklistType: 'Go-Live' | 'Web Development', companyDescription: string, sitemap: SitemapPage[], temperature: number): Promise<string[]> => {
  if (!API_KEY) throw new Error("API_KEY not configured. Check VITE_API_KEY in your .env file.");
  try {
    let specificInstruction = '';
    if (checklistType === 'Go-Live') {
      specificInstruction = "Generate a 'Go-Live Checklist' with 5-7 essential items to verify before launching this new website. Focus on critical checks like testing, SEO basics, analytics, and backups.";
    } else if (checklistType === 'Web Development') {
      specificInstruction = "Generate a 'Web Development Checklist' with 5-7 key tasks or considerations for the development phase of this website. Focus on aspects like responsive design, accessibility, performance, and security.";
    }

    const systemInstruction = `You are an expert project manager and web developer.
    Based on the company description, sitemap, and the requested checklist type, generate a relevant checklist.
    ${specificInstruction}
    Return the checklist as a JSON array of strings, where each string is a concise checklist item.
    Example for Go-Live: ["Test all forms and CTAs thoroughly.", "Verify SSL certificate installation.", "Set up Google Analytics and Search Console."]`;
    
    const sitemapSummary = sitemap.map(p => p.pageName).join(', ');
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: `Generate a ${checklistType} checklist for a website. Company: "${companyDescription}". Sitemap: ${sitemapSummary}.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: temperature,
      },
    });
    return parseJsonFromResponse<string[]>(response.text, []);
  } catch (error) {
    console.error(`Error generating ${checklistType} checklist:`, error);
    throw new Error(`Failed to generate ${checklistType} checklist. ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const generateSerpPreviewContent = async (companyDescription: string, homepageData: SitemapPage | undefined, temperature: number): Promise<SerpPreviewContent> => {
  if (!API_KEY) throw new Error("API_KEY not configured. Check VITE_API_KEY in your .env file.");
  try {
    const systemInstruction = `You are an SEO copywriter. Generate an optimized SERP (Search Engine Results Page) title and meta description for a website's homepage.
    The title should be concise (around 50-60 characters) and include the main company/brand name and primary keywords.
    The meta description should be compelling (around 150-160 characters) and summarize the website's main offering or value proposition, encouraging clicks.
    Use "https://example.com" as the placeholder URL.
    Return the result as a JSON object with keys 'title' (string), 'description' (string), and 'url' (string, use "https://example.com").
    Example: {"title": "Example Co - Innovative Solutions for Modern Businesses", "description": "Discover Example Co's cutting-edge services designed to boost your productivity and growth. Learn more about our unique approach today!", "url": "https://example.com"}`;

    const pageCtx = homepageData ? `Homepage name: "${homepageData.pageName}", Homepage description: "${homepageData.pageDescription}"` : "No specific homepage data provided, focus on the overall company description.";

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: `Generate SERP title and description for a website. Company: "${companyDescription}". ${pageCtx}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: temperature,
      },
    });
    return parseJsonFromResponse<SerpPreviewContent>(response.text, { title: "Error generating title", description: "Error generating description", url: "https://example.com" });
  } catch (error) {
    console.error("Error generating SERP preview content:", error);
    throw new Error(`Failed to generate SERP preview. ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const generateSeoStrategyInsights = async (companyDescription: string, sitemap: SitemapPage[], ldJsonSchemaArray: Array<Record<string, any>> | null, temperature: number): Promise<SeoStrategyInsight[]> => {
  if (!API_KEY) throw new Error("API_KEY not configured. Check VITE_API_KEY in your .env file.");
  try {
    const systemInstruction = `You are an expert SEO strategist. Provide 2-3 high-level SEO strategy insights for a website.
    Each insight should have an 'id' (string, unique, e.g., 'insight-1'), a 'title' (string, concise), an 'explanation' (string, 2-3 sentences), and optionally 'actionableTips' (JSON array of 1-2 short string tips).
    Focus on how page structure (from sitemap), content elements (keywords in titles, alt text usage, 'rel' attributes for links), and LD+JSON schema can work together.
    Return insights as a JSON array of objects.
    Example: [{"id": "insight-1", "title": "Semantic Content Hubs", "explanation": "Group related content pages (e.g., services, blog posts) around a central pillar page identified in your sitemap. This strengthens topical authority.", "actionableTips": ["Use internal links with descriptive anchor text.", "Ensure your LD+JSON schema reflects this structure if applicable (e.g., using 'hasPart' for Article schema)."]}]`;

    const sitemapSummary = sitemap.map(p => p.pageName).join(', ');
    const ldJsonCtx = ldJsonSchemaArray && ldJsonSchemaArray.length > 0 ? `The site has the following LD+JSON schemas (first few summarized): ${JSON.stringify(ldJsonSchemaArray.slice(0,2).map(s => ({type: s['@type'], name: s.name}))).substring(0, 300)}...` : "No LD+JSON schema has been generated yet.";

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: `Provide SEO strategy insights. Company: "${companyDescription}". Sitemap: ${sitemapSummary}. ${ldJsonCtx}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: temperature,
      },
    });
    const rawInsights = parseJsonFromResponse<Array<any>>(response.text, []);
    return rawInsights.map((insight, index) => ({
      id: insight.id || `seo-insight-${Date.now()}-${index}`,
      title: insight.title || "Untitled Insight",
      explanation: insight.explanation || "No explanation provided.",
      actionableTips: insight.actionableTips || [],
    }));

  } catch (error) {
    console.error("Error generating SEO strategy insights:", error);
    throw new Error(`Failed to generate SEO strategy insights. ${error instanceof Error ? error.message : String(error)}`);
  }
};

