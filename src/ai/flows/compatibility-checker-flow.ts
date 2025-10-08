
'use server';
/**
 * @fileOverview An AI-powered compatibility checker for electronic spare parts.
 *
 * - checkPartCompatibility - A function that checks if a part is compatible with a user's device.
 * - PartCompatibilityInput - The input type for the function.
 * - PartCompatibilityOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PartCompatibilityInputSchema = z.object({
  partTitle: z.string().describe("The title of the spare part listing, e.g., 'Screen Assembly for Samsung Galaxy M31'."),
  partDescription: z.string().describe("The description of the spare part, which may contain model numbers or specifications."),
  userDeviceModel: z.string().describe("The full model name of the user's device, e.g., 'Samsung Galaxy A51'."),
});
export type PartCompatibilityInput = z.infer<typeof PartCompatibilityInputSchema>;

const PartCompatibilityOutputSchema = z.object({
    compatibilityLevel: z.enum([
        "High", 
        "Partial", 
        "Incompatible"
    ]).describe("The final compatibility decision."),
  explanation: z.string().describe("A brief, clear explanation for your reasoning."),
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
  prompt: `You are an expert electronics repair technician with access to a comprehensive database of device schematics and part numbers.

Task: Determine the compatibility between a spare part and a target device.
Spare Part: "{{partTitle}}"
Spare Part Description: "{{partDescription}}"
Target Device: "{{userDeviceModel}}"

Analyze specifications like screen dimensions, connector types, model numbers, and year of release.

Return your response in a JSON object with two keys:
- "compatibilityLevel": Choose one of 'High', 'Partial', or 'Incompatible'.
- "explanation": A brief, clear explanation for your reasoning.
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
