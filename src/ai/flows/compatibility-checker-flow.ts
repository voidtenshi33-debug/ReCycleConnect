
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
  partTitle: z.string().describe("The title of the spare part listing, e.g., '8GB DDR4 2400MHz SODIMM RAM'."),
  partDescription: z.string().describe("The description of the spare part, which may contain model numbers or specifications."),
  userDeviceModel: z.string().describe("The full model name of the user's device, e.g., 'HP Pavilion 15-cs0053cl' or 'Dell XPS 13 9380'."),
});
export type PartCompatibilityInput = z.infer<typeof PartCompatibilityInputSchema>;

const PartCompatibilityOutputSchema = z.object({
    verdict: z.enum([
        "✅ High Compatibility", 
        "⚠️ Partial Compatibility", 
        "❌ Incompatible"
    ]).describe("The final compatibility decision."),
  reasoning: z.string().describe("A concise, one-sentence explanation for the verdict, explaining why the part is or isn't compatible."),
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
  prompt: `You are an expert computer and electronics technician. Your task is to determine if a given spare part is compatible with a user's device.

Analyze the following information:
- Spare Part Title: {{{partTitle}}}
- Spare Part Description: {{{partDescription}}}
- User's Device Model: {{{userDeviceModel}}}

Cross-reference the specifications of the spare part with the known specifications and requirements of the user's device. Consider factors like physical connectors, form factor (e.g., DDR3 vs DDR4 RAM), power requirements, and software/driver compatibility.

Provide a clear verdict and a simple, one-sentence explanation.
- If it's a perfect match, use "✅ High Compatibility".
- If it might work but with limitations (e.g., RAM running at a slower speed), use "⚠️ Partial Compatibility".
- If it will not work, use "❌ Incompatible".

Example Reasoning:
- "This DDR4 RAM is compatible with your Dell XPS 13, which uses the same memory type."
- "This graphics card uses a PCIe x16 slot, which your motherboard supports."
- "This laptop screen is not compatible because the connector type is different."

Return your response in the specified JSON format.
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
