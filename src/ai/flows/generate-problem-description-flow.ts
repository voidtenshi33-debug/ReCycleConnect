
'use server';
/**
 * @fileOverview An AI flow to generate a problem description from images of a damaged device.
 *
 * - generateProblemDescription - A function that generates a description of the problem.
 * - GenerateProblemDescriptionInput - The input type for the function.
 * - GenerateProblemDescriptionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProblemDescriptionInputSchema = z.object({
  images: z.array(z.string()).describe("An array of image data URIs showing the device's damage. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateProblemDescriptionInput = z.infer<typeof GenerateProblemDescriptionInputSchema>;

const GenerateProblemDescriptionOutputSchema = z.object({
  problemDescription: z.string().describe("A detailed description of the visible damage or issue with the electronic item. e.g., 'The screen has a large crack across the top right corner.' or 'The charging port appears to be bent.'"),
});
export type GenerateProblemDescriptionOutput = z.infer<typeof GenerateProblemDescriptionOutputSchema>;


export async function generateProblemDescription(
  input: GenerateProblemDescriptionInput
): Promise<GenerateProblemDescriptionOutput> {
  return generateProblemDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProblemDescriptionPrompt',
  input: { schema: GenerateProblemDescriptionInputSchema },
  output: { schema: GenerateProblemDescriptionOutputSchema },
  prompt: `You are an expert electronics repair technician. Your task is to write a clear and concise description of the problem based on images of a damaged item.

Analyze the following images to identify the physical damage. Look for cracked screens, case damage, water damage indicators, bent ports, or other visible issues.

{{#each images as |image|}}
Image {{@index}}: {{media url=image}}
{{/each}}

Based on your analysis, write a 1-2 sentence description focusing ONLY on the visible damage.
- Be specific (e.g., "The top left corner of the screen is cracked," not just "Screen is broken").
- If no damage is visible, state that "No physical damage is visible in the images."
- Do not guess about internal issues you cannot see.

Provide your response in the specified JSON format.
`,
});

const generateProblemDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProblemDescriptionFlow',
    inputSchema: GenerateProblemDescriptionInputSchema,
    outputSchema: GenerateProblemDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
