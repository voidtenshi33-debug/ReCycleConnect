
'use server';

/**
 * @fileOverview Translates text to a specified language.
 *
 * - translateText - A function that takes text and a target language and returns the translation.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.string().describe("The target language for translation (e.g., 'Hindi', 'Marathi', 'French')."),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translation: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(
  input: TranslateTextInput
): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: { schema: TranslateTextInputSchema },
  output: { schema: TranslateTextOutputSchema },
  prompt: `Translate the following text to {{targetLanguage}}.
  
  Text: "{{text}}"
  
  Return ONLY the translated text.`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input) => {
    // For very short, common UI strings, translation models can sometimes be too literal
    // or return the original text. Adding context helps.
    if (input.text.split(' ').length <= 2) {
      const { output } = await prompt({
        ...input,
        text: `Translate the UI label '${input.text}' to ${input.targetLanguage}.`,
      });
      return output!;
    }
    
    const { output } = await prompt(input);
    return output!;
  }
);
