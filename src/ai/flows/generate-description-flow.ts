
'use server';
/**
 * @fileOverview An AI flow to generate a product description from images.
 *
 * - generateDescriptionFromImages - A function that generates a description based on images.
 * - GenerateDescriptionInput - The input type for the function.
 * - GenerateDescriptionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateDescriptionInputSchema = z.object({
  images: z.array(z.string()).describe("An array of image data URIs showing the device's condition. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateDescriptionInput = z.infer<typeof GenerateDescriptionInputSchema>;

const GenerateDescriptionOutputSchema = z.object({
  description: z.string().describe("A detailed, honest, and appealing description of the item's condition, features, and any visible issues. Should be 2-3 sentences long."),
});
export type GenerateDescriptionOutput = z.infer<typeof GenerateDescriptionOutputSchema>;


export async function generateDescriptionFromImages(
  input: GenerateDescriptionInput
): Promise<GenerateDescriptionOutput> {
  return generateDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDescriptionPrompt',
  input: { schema: GenerateDescriptionInputSchema },
  output: { schema: GenerateDescriptionOutputSchema },
  prompt: `You are an expert copywriter for ReCycleConnect, a marketplace for used electronics. Your task is to write a compelling, honest, and clear product description based on images of an item.

Analyze the following images to assess the item's physical condition. Look for scratches, cracks, screen damage, dents, and overall wear and tear. Also, note any positive attributes like a clean screen or minimal wear.

{{#each images}}
Image {{@index}}: {{media url=this}}
{{/each}}

Based on your analysis, write a 2-3 sentence description.
- Be honest about any visible damage (e.g., "Has a few minor scuffs on the back casing, but the screen is in great condition.").
- Highlight positive aspects (e.g., "Looks almost new, with no noticeable scratches.").
- Be descriptive and helpful to a potential buyer. For example, instead of just "Scratched", say "There are some light surface scratches on the screen, but they aren't visible when it's on."
- Do not invent details you cannot see. If the condition is unclear, describe it neutrally (e.g., "Shows some signs of use.").

Provide your response in the specified JSON format.
`,
});

const generateDescriptionFlow = ai.defineFlow(
  {
    name: 'generateDescriptionFlow',
    inputSchema: GenerateDescriptionInputSchema,
    outputSchema: GenerateDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
