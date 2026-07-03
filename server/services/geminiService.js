import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const seoAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        overallScore: { type: Type.INTEGER },
        categories: {
            type: Type.OBJECT,
            properties: {
                seo: { type: Type.INTEGER },
                performance: { type: Type.INTEGER },
                accessibility: { type: Type.INTEGER },
                bestPractices: { type: Type.INTEGER },
            },
            required: ["seo", "performance", "accessibility", "bestPractices"],
        },
        keywords: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    word: { type: Type.STRING },
                    count: { type: Type.INTEGER },
                    density: { type: Type.NUMBER },
                },
                required: ["word", "count", "density"],
            },
        },
        issues: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    severity: { type: Type.STRING }, // Simplified to Type.STRING to prevent 500 mapping errors
                    category: { type: Type.STRING },
                    message: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                },
                required: ["severity", "category", "message", "recommendation"],
            },
        },
    },
    required: ["overallScore", "categories", "keywords", "issues"],
};

export async function analyzeSeoData(scrapedData) {
    try {
        const prompt = `You are an expert SEO analyst. Analyze the following website data and provide a comprehensive SEO audit.

        Website URL: ${scrapedData.url}
        Load Time: ${scrapedData.loadTime}ms
        Status Code: ${scrapedData.statusCode}
        Page Size: ${Math.round(scrapedData.pageSize / 1024)}KB
        Word Count: ${scrapedData.wordCount}

        META DATA:
        - Title: "${scrapedData.metaData.title}"
        - Description: "${scrapedData.metaData.description}"
        - Canonical: "${scrapedData.metaData.canonical}"
        - Robots: "${scrapedData.metaData.robots}"
        - OG Title: "${scrapedData.metaData.ogTitle}"
        - OG Description: "${scrapedData.metaData.ogDescription}"

        HEADINGS:
        - H1: ${scrapedData.headings.h1} (texts: ${JSON.stringify(scrapedData.headings.h1Texts)})
        - H2: ${scrapedData.headings.h2}
        - H3: ${scrapedData.headings.h3}

        LINKS:
        - Internal: ${scrapedData.links.internal}
        - External: ${scrapedData.links.external}

        IMAGES:
        - Total: ${scrapedData.images.total}
        - Missing Alt Text: ${scrapedData.images.missingAlt}

        PAGE CONTENT (first 3000 chars):
        ${scrapedData.bodyText}

        CRITICAL REQUIREMENT FOR SEVERITY: 
        For every issue object in the "issues" array, the "severity" field MUST be exactly one of these lowercase strings: "critical", "warning", or "info". Do not use any other values.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash", // Updated to the stable modern SDK standard
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: seoAnalysisSchema,
            },
        });

        const analysis = JSON.parse(response.text);
        return { success: true, data: analysis };
        
    } catch (error) {
        console.error("Gemini analysis error:", error.message);
        return { success: false, error: error.message };
    }
}