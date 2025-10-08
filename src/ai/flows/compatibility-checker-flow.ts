
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

const PartCompatibilityOutputSchema = z.object({
    partIdentification: z.string().describe("A brief identification of what the scrap part appears to be, e.g., 'a DDR4 laptop RAM stick' or 'a screen assembly.'"),
    compatibilityLevel: z.enum([
        "High", 
        "Partial", 
        "Incompatible",
        "Unknown"
    ]).optional().describe("The final compatibility decision ONLY if a target device is provided. Omit if no target device is given."),
    explanation: z.string().optional().describe("A brief, clear explanation for your reasoning if a target device is provided. Omit if no target device is given."),
    compatibleDevices: z.array(z.object({
        brand: z.string().describe("The brand of compatible devices, e.g., 'Dell' or 'Apple'."),
        exampleModels: z.array(z.string()).describe("An array of specific model names that are compatible, e.g., ['Inspiron 15 5000', 'Latitude 7490'].")
    })).optional().describe("A list of device brands and models compatible with the scrap part. Provide this if possible."),
});

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

Task: Identify a scrap part and determine its compatibility.

Scrap Part Title: "{{partTitle}}"
Scrap Part Description: "{{partDescription}}"
{{#if images}}
Scrap Part Image(s):
{{#each images}}
Image {{@index}}: {{media url=this}}
{{/each}}
{{/if}}
Target Device (Optional): "{{userDeviceModel}}"

1.  **Identify the Part**: First, use the images and text to visually identify the part. Determine its type (e.g., 'RAM stick', 'Wi-Fi card'), connectors, and any visible model numbers. Formulate a brief 'partIdentification'.

2.  **Find Compatible Devices**: Based on your identification, identify a list of popular device brands and specific example models known to be compatible with this part. Populate the 'compatibleDevices' array.

3.  **Perform Direct Check (if applicable)**: If a 'userDeviceModel' is provided, perform a direct compatibility check.
    *   Determine the compatibility level ('High', 'Partial', 'Incompatible').
    *   Provide a clear 'explanation' for your reasoning.
    *   Set the 'compatibilityLevel' and 'explanation' fields in the output. If you cannot determine compatibility, set the level to 'Unknown'.
    *   If no 'userDeviceModel' is provided, you MUST OMIT the 'compatibilityLevel' and 'explanation' fields.
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
