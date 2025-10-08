
'use server';
/**
 * @fileOverview An AI-powered compatibility checker for electronic scrap parts.
 *
 * - checkPartCompatibility - A function that checks if a part is compatible with a user's device or finds compatible devices for a scrap part.
 * - PartCompatibilityInput - The input type for the function.
 * - PartCompatibilityOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PartCompatibilityInputSchema = z.object({
  partTitle: z.string().optional().describe("The title or name of the spare part listing, e.g., 'Screen Assembly for Samsung Galaxy M31'."),
  partDescription: z.string().optional().describe("The description of the spare part, which may contain model numbers or specifications."),
  images: z.array(z.string()).optional().describe("An array of image data URIs showing the scrap part. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  userDeviceModel: z.string().optional().describe("The full model name of the user's device, e.g., 'Samsung Galaxy A51'."),
});
export type PartCompatibilityInput = z.infer<typeof PartCompatibilityInputSchema>;

const DirectCheckOutputSchema = z.object({
    compatibilityLevel: z.enum([
        "High", 
        "Partial", 
        "Incompatible"
    ]).describe("The final compatibility decision."),
    explanation: z.string().describe("A brief, clear explanation for your reasoning, written for a non-expert."),
});

const BroadSearchOutputSchema = z.object({
    compatibleDevices: z.array(z.object({
        brand: z.string().describe("The brand of compatible devices, e.g., 'Dell' or 'Apple'."),
        exampleModels: z.array(z.string()).describe("An array of specific model names that are compatible, e.g., ['Inspiron 15 5000', 'Latitude 7490'].")
    })).describe("A list of device brands and models compatible with the scrap part."),
     partIdentification: z.string().describe("A brief identification of what the scrap part appears to be, e.g., 'a DDR4 laptop RAM stick'.")
});

const PartCompatibilityOutputSchema = z.union([DirectCheckOutputSchema, BroadSearchOutputSchema]);
export type PartCompatibilityOutput = z.infer<typeof PartCompatibilityOutputSchema>;


export async function checkPartCompatibility(
  input: PartCompatibilityInput
): Promise<PartCompatibilityOutput> {
  return compatibilityCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compatibilityCheckerPrompt',
  input: { schema: PartCompatibilityInputSchema },
  output: { schema: PartCompatibilityOutputSchema },
  prompt: `You are an expert electronics repair technician with access to a comprehensive database of device schematics and part numbers. You can analyze both text descriptions and images.

Task: Determine compatibility based on the provided scrap part details (text and/or image) and a target device (if provided). If no target device is provided, identify compatible brands/models for the scrap part.

Scrap Part Title: "{{partTitle}}"
Scrap Part Description: "{{partDescription}}"
{{#if images}}
Scrap Part Image(s):
{{#each images}}
Image {{@index}}: {{media url=this}}
{{/each}}
{{/if}}
Target Device (Optional): "{{userDeviceModel}}"

Analyze: Use the images to visually identify the part type, connectors, chips, and any visible model numbers. Combine this visual analysis with the text description and your knowledge base.

If Target Device is PROVIDED (Direct Check):
Determine the compatibility between the scrap part and the target device.
Return: JSON object with "compatibilityLevel" ('High', 'Partial', 'Incompatible') and "explanation" (brief, clear reasoning).

If Target Device is NOT PROVIDED (Broad Search):
First, identify the scrap part based on the images and text.
Then, identify a list of popular device brands and specific example models that are known to be compatible with the scrap part.
Return: JSON object with "partIdentification" and "compatibleDevices" (an array of objects, each with "brand" and an array of "exampleModels").
`,
});

const compatibilityCheckerFlow = ai.defineFlow(
  {
    name: 'compatibilityCheckerFlow',
    inputSchema: PartCompatibilityInputSchema,
    outputSchema: PartCompatibilityOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
