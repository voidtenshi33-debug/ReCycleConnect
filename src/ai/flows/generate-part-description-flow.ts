
'use server';
/**
 * @fileOverview An AI flow to generate a description for a scrap electronic part from images.
 *
 * - generatePartDescription - A function that generates a description of the part.
 * - GeneratePartDescriptionInput - The input type for the function.
 * - GeneratePartDescriptionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePartDescriptionInputSchema = z.object({
  images: z.array(z.string()).describe("An array of image data URIs showing the scrap part. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GeneratePartDescriptionInput = z.infer<typeof GeneratePartDescriptionInputSchema>;

const GeneratePartDescriptionOutputSchema = z.object({
  partDescription: z.string().describe("A factual, technical description of the electronic part. Identify any visible model numbers, text, chipsets, or connector types. e.g., 'Appears to be a stick of DDR4 laptop RAM, labeled with part number M471A1K43CB1-CTD.' or 'A motherboard with an Intel Core i5-8250U CPU soldered on.'"),
});
export type GeneratePartDescriptionOutput = z.infer<typeof GeneratePartDescriptionOutputSchema>;


export async function generatePartDescription(
  input: GeneratePartDescriptionInput
): Promise<GeneratePartDescriptionOutput> {
  return generatePartDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePartDescriptionPrompt',
  input: { schema: GeneratePartDescriptionInputSchema },
  output: { schema: GeneratePartDescriptionOutputSchema },
  prompt: `You are an expert electronics hardware identifier. Your task is to write a clear, concise, and technical description of the electronic component shown in the images.

Analyze the following images to identify the part. Focus on:
- Any visible text, part numbers, model numbers, or manufacturer names (e.g., 'Samsung', 'Intel', 'M471A1K43CB1-CTD').
- The type of component (e.g., 'RAM stick', 'CPU', 'motherboard', 'Wi-Fi card').
- The type of connectors or ports visible.
- Any notable chips or integrated circuits.

{{#each images as |image|}}
Image {{@index}}: {{media url=image}}
{{/each}}

Based on your analysis, write a 1-2 sentence technical description.
- Be factual and prioritize any text you can read from the images.
- Do not guess about the condition. Only describe what the part is.

Provide your response in the specified JSON format.
`,
});

const generatePartDescriptionFlow = ai.defineFlow(
  {
    name: 'generatePartDescriptionFlow',
    inputSchema: GeneratePartDescriptionInputSchema,
    outputSchema: GeneratePartDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
