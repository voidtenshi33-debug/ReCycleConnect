'use server';

/**
 * @fileOverview Suggests item categories based on an image.
 *
 * - suggestItemCategory - A function that suggests item categories based on an image.
 * - SuggestItemCategoryInput - The input type for the suggestItemCategory function.
 * - SuggestItemCategoryOutput - The return type for the suggestItemCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestItemCategoryInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // data URI
    ),
});
export type SuggestItemCategoryInput = z.infer<typeof SuggestItemCategoryInputSchema>;

const SuggestItemCategoryOutputSchema = z.object({
  suggestedCategories: z
    .array(z.string())
    .describe('An array of suggested item categories.'),
});
export type SuggestItemCategoryOutput = z.infer<typeof SuggestItemCategoryOutputSchema>;

export async function suggestItemCategory(
  input: SuggestItemCategoryInput
): Promise<SuggestItemCategoryOutput> {
  return suggestItemCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestItemCategoryPrompt',
  input: {schema: SuggestItemCategoryInputSchema},
  output: {schema: SuggestItemCategoryOutputSchema},
  prompt: `You are an AI assistant that suggests item categories based on an image.

  Analyze the image and suggest relevant item categories. Provide at least three category suggestions.

  Image: {{media url=photoDataUri}}
  Categories:`, //handlebars syntax
});

const suggestItemCategoryFlow = ai.defineFlow(
  {
    name: 'suggestItemCategoryFlow',
    inputSchema: SuggestItemCategoryInputSchema,
    outputSchema: SuggestItemCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
