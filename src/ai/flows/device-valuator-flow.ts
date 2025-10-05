
'use server';
/**
 * @fileOverview An AI-powered device valuator.
 *
 * - evaluateDevice - A function that estimates device value based on images.
 * - DeviceValuationInput - The input type for the evaluateDevice function.
 * - DeviceValuationOutput - The return type for the evaluateDevice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DeviceValuationInputSchema = z.object({
  deviceName: z.string().describe('The name of the device, e.g., "iPhone 13 Pro".'),
  images: z.array(z.string()).describe("An array of image data URIs showing the device's condition. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type DeviceValuationInput = z.infer<typeof DeviceValuationInputSchema>;

const DeviceValuationOutputSchema = z.object({
  conditionAssessment: z.string().describe("A brief, one-sentence assessment of the device's condition based on the images."),
  estimatedLowPrice: z.number().describe("The low-end of the estimated resale value in Indian Rupees (₹)."),
  estimatedHighPrice: z.number().describe("The high-end of the estimated resale value in Indian Rupees (₹)."),
  reasoning: z.string().describe("A short explanation for the valuation, mentioning factors like visible damage or good condition."),
});
export type DeviceValuationOutput = z.infer<typeof DeviceValuationOutputSchema>;


export async function evaluateDevice(
  input: DeviceValuationInput
): Promise<DeviceValuationOutput> {
  return evaluateDeviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'deviceValuatorPrompt',
  input: { schema: DeviceValuationInputSchema },
  output: { schema: DeviceValuationOutputSchema },
  prompt: `You are an expert electronics evaluator for ReCycleConnect, an Indian marketplace for used gadgets. Your task is to analyze images of a device and provide a realistic resale valuation in Indian Rupees (₹).

Device Name: {{{deviceName}}}

Analyze the following images to assess the item's physical condition. Look for scratches, cracks, dents, and overall wear and tear.
{{#each images}}
Image {{@index}}: {{media url=this}}
{{/each}}

Based on your analysis, provide a resale price range.
- If the device looks to be in excellent or like-new condition, provide a higher valuation.
- If there is visible damage like deep scratches or cracks, significantly lower the valuation.
- For moderate, everyday wear and tear, provide a mid-range valuation.

Provide your response in the specified JSON format. The prices must be in Indian Rupees (₹).
`,
});

const evaluateDeviceFlow = ai.defineFlow(
  {
    name: 'evaluateDeviceFlow',
    inputSchema: DeviceValuationInputSchema,
    outputSchema: DeviceValuationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
