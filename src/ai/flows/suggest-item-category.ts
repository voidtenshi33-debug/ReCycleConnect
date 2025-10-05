
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
import { categories } from '@/lib/data';

const SuggestItemCategoryInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // data URI
    ),
});
export type SuggestItemCategoryInput = z.infer<typeof SuggestItemCategoryInputSchema>;

const validCategories = categories.map(c => c.name);

const SuggestItemCategoryOutputSchema = z.object({
  suggestedCategories: z
    .array(z.string())
    .describe(`An array of up to 3 suggested item categories from the following list: ${validCategories.join(', ')}`),
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
  prompt: `You are an AI assistant for an electronics recycling app called ReCycleConnect. Your task is to suggest relevant categories for a user's item based on an image they upload.

  Analyze the image provided and suggest up to 3 of the most relevant categories from the following official list. The suggestions should be ordered from most to least relevant.

  Official Category List:
  - Mobiles
  - Laptops
  - Keyboards
  - Monitors
  - Cables
  - Audio
  - Components
  - Other

  Image: {{media url=photoDataUri}}
  
  Return your suggestions in the specified output format.`,
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
