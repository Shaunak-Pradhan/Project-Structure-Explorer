
import { GoogleGenAI, Type } from "@google/genai";
import type { ProjectStructureResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// This function programmatically builds a recursive schema for the file tree.
const buildRecursiveFileTreeSchema = (depth: number): any => {
  const nodeSchema: any = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      type: { type: Type.STRING, enum: ['file', 'folder'] },
      purpose: { type: Type.STRING },
      snippet: { type: Type.STRING, nullable: true },
      alternatives: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
    },
    required: ["name", "type", "purpose"],
  };

  if (depth > 0) {
    nodeSchema.properties.children = {
      type: Type.ARRAY,
      nullable: true,
      items: buildRecursiveFileTreeSchema(depth - 1),
    };
  }

  return nodeSchema;
};


const responseSchema = {
    type: Type.OBJECT,
    properties: {
        technology: { type: Type.STRING },
        complexity: { type: Type.STRING },
        fileTree: buildRecursiveFileTreeSchema(5), // Build schema with a depth of 5
        runCommands: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING },
                    command: { type: Type.STRING }
                },
                required: ["description", "command"]
            }
        },
        dependencies: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    setup: { type: Type.STRING }
                },
                required: ["name", "setup"]
            }
        }
    },
    required: ["technology", "complexity", "fileTree", "runCommands", "dependencies"]
};

const buildPrompt = (technology: string, complexity: string): string => {
  return `
You are a "Project Structure Architect AI". Your task is to generate a complete project structure for a given technology and complexity level. You MUST respond with only a valid JSON object that adheres to the provided schema. Do not include any introductory text, closing remarks, or markdown formatting like \`\`\`json blocks.

The user wants to understand the purpose of each file and folder in a typical project.

**Technology:** "${technology}"
**Complexity:** "${complexity}"

**Complexity Guide:**
- **Simple:** A minimal, "hello world" or getting-started setup. Just the absolute essentials to make it run.
- **Intermediate:** A more realistic project. Include common configuration files, a basic component/module structure, and maybe a simple test file.
- **Complex:** An enterprise-grade or large-scale application structure. Include directories for testing (unit, e2e), CI/CD configuration (e.g., .github/workflows), containerization (Dockerfile, docker-compose.yml), environment variable management, detailed configuration, and a scalable source code structure.

**Instructions for JSON fields:**
- \`name\`: The file or folder name. For the root, use the project name (e.g., '${technology.toLowerCase()}-${complexity.toLowerCase()}-project').
- \`type\`: 'file' or 'folder'.
- \`purpose\`: A clear, beginner-friendly explanation of what this file/folder is for. Explain its role in the project. Max 2-3 sentences.
- \`snippet\`: For files, provide a small, relevant, and illustrative code snippet. For config files, show a few key settings. For source files, a simple "hello world" or basic function. Keep it short. Use "\\n" for newlines. For folders, this field should be omitted.
- \`alternatives\`: An array of common alternative names, if any (e.g., for ".env", you might include "config.env"). Omit if none.
- \`children\`: For folders, recursively define the files and subfolders inside. Ensure the recursion depth matches the complexity level. Simple projects should be flat, complex ones deeply nested.
- \`runCommands\`: Provide a list of typical commands to set up and run the project.
- \`dependencies\`: List key external dependencies (like a database or environment variables) and explain how to set them up.
`;
};


export const generateProjectStructure = async (technology: string, complexity: string): Promise<ProjectStructureResponse> => {
  const prompt = buildPrompt(technology, complexity);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });

  const text = response.text;
  try {
    const parsed = JSON.parse(text);
    return parsed as ProjectStructureResponse;
  } catch (e) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("Received malformed JSON from the API.");
  }
};
