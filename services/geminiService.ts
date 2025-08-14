
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SitemapPage, WireframeSection, PageWireframe } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const modelName = 'gemini-2.5-flash-preview-04-17'; // Consistent model name

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
            if (('pageName' in singleObject && 'pageDescription' in singleObject) || 
                ('sectionName' in singleObject && 'sectionPurpose' in singleObject)) {
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
  if (!API_KEY) throw new Error("API_KEY not configured.");
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
  if (!API_KEY) throw new Error("API_KEY not configured.");
  try {
    const systemInstruction = `You are an expert UI/UX designer. Your task is to outline the key sections for a webpage based on its purpose and the overall website context.
    For each section, provide a 'sectionName' (e.g., 'Hero Banner', 'Key Features', 'Testimonials', 'Call to Action') and a brief 'sectionPurpose' (e.g., 'Grab attention and state value proposition', 'Highlight product benefits', 'Build trust with social proof').
    Return this as a JSON array of objects, where each object has 'sectionName' (string) and 'sectionPurpose' (string) keys. Focus on a logical flow of information for the user.
    Example: [{"sectionName": "Navigation Bar", "sectionPurpose": "Provide easy access to all major site pages."}, {"sectionName": "Hero Section", "sectionPurpose": "Introduce the page's main topic and value."}]`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: `For a page titled "${pageName}" with the description "${pageDescription}", which is part of a website for "${companyDescription}", generate a list of typical sections or content blocks.`,
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

export const generateLdJsonSchema = async (companyDescription: string, sitemap: SitemapPage[], temperature: number): Promise<string> => {
  if (!API_KEY) throw new Error("API_KEY not configured.");
  try {
    const systemInstruction = `You are an expert SEO specialist. Your task is to generate a basic LD+JSON schema for a website.
    Based on the company description and sitemap, create a single JSON-LD script content string.
    It should typically be for '@type': 'Organization' or '@type': 'LocalBusiness'. Include essential properties like 'name', 'url' (use a placeholder like "https://example.com" if not specified), 'description', and potentially 'logo' or 'address' if discernible.
    If it's a local business, try to include 'address' (streetAddress, addressLocality, postalCode, addressCountry - use placeholders if specific details are missing but the type implies locality), and 'telephone'.
    Return ONLY the JSON-LD content as a single, minified valid JSON string. Do NOT wrap it in <script> tags or markdown.
    Example for Organization: {"@context":"https://schema.org","@type":"Organization","name":"Example Corp","url":"https://example.com","description":"A sample company description.","logo":"https://example.com/logo.png"}
    Example for LocalBusiness: {"@context":"https://schema.org","@type":"LocalBusiness","name":"Example Bakery","url":"https://example.com","description":"A local bakery.","address":{"@type":"PostalAddress","streetAddress":"123 Main St","addressLocality":"Anytown","postalCode":"12345","addressCountry":"US"},"telephone":"+1-555-123-4567"}`;
    
    const sitemapSummary = sitemap.map(p => p.pageName).join(', ');
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: `Generate LD+JSON schema for a website. Company description: "${companyDescription}". Sitemap pages include: ${sitemapSummary}. Determine if it's a general Organization or a LocalBusiness.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json", // Expecting the AI to return a JSON string that represents the schema
        temperature: temperature,
      },
    });
    // The AI is asked to return a string which is the JSON-LD.
    // We will parse it to validate it's JSON, then re-stringify for consistent formatting if needed, or use raw.
    // For simplicity, we directly use the text if it's a valid JSON string as requested.
    const schemaText = response.text.trim();
    try {
      JSON.parse(schemaText); // Validate it's valid JSON
      return schemaText;
    } catch (e) {
      console.error("LD+JSON returned by AI is not valid JSON:", schemaText, e);
      throw new Error("Generated LD+JSON schema was not valid JSON. Please try again.");
    }
  } catch (error) {
    console.error("Error generating LD+JSON schema:", error);
    throw new Error(`Failed to generate LD+JSON schema. ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const generateSiteSuggestions = async (companyDescription: string, sitemap: SitemapPage[], temperature: number): Promise<string[]> => {
  if (!API_KEY) throw new Error("API_KEY not configured.");
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
  if (!API_KEY) throw new Error("API_KEY not configured.");
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
