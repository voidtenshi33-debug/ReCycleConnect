
'use server';
/**
 * @fileOverview An AI flow to generate a product title from images, category, and brand.
 *
 * - generateTitle - A function that generates a title.
 * - GenerateTitleInput - The input type for the function.
 * - GenerateTitleOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTitleInputSchema = z.object({
  images: z.array(z.string()).describe("An array of image data URIs showing the device's condition. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  category: z.string().describe("The user-selected category for the item."),
  brand: z.string().optional().describe("The user-provided brand of the item."),
});
export type GenerateTitleInput = z.infer<typeof GenerateTitleInputSchema>;

const GenerateTitleOutputSchema = z.object({
  title: z.string().describe("A concise, accurate, and marketable title for the item listing based on the provided information. e.g., 'Apple iPhone 14 Pro, 256GB' or 'Dell XPS 15 Laptop (2022)'."),
});
export type GenerateTitleOutput = z.infer<typeof GenerateTitleOutputSchema>;


export async function generateTitle(
  input: GenerateTitleInput
): Promise<GenerateTitleOutput> {
  return generateTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTitlePrompt',
  input: { schema: GenerateTitleInputSchema },
  output: { schema: GenerateTitleOutputSchema },
  prompt: `You are an expert copywriter for ReCycleConnect, a marketplace for used electronics. Your task is to write a concise and accurate title for a product listing.

Analyze the following information:
- Category: {{category}}
{{#if brand}}- Brand: {{brand}}{{/if}}
- Images:
{{#each images as |image|}}
Image {{@index}}: {{media url=image}}
{{/each}}

Based on your analysis, generate a clear and marketable title for the item.
- Include the brand and model if identifiable from the images.
- Keep it concise and to the point.
- Do not invent details you cannot see. If a specific model or storage size isn't clear, don't include it.

Provide your response in the specified JSON format.
`,
});

const generateTitleFlow = ai.defineFlow(
  {
    name: 'generateTitleFlow',
    inputSchema: GenerateTitleInputSchema,
    outputSchema: GenerateTitleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
