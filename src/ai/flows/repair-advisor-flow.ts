
'use server';
/**
 * @fileOverview An AI-powered repair advisor for broken electronics.
 *
 * - getRepairAdvice - A function that provides repair advice.
 * - RepairAdviceInput - The input type for the getRepairAdvice function.
 * - RepairAdviceOutput - The return type for the getRepairAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RepairAdviceInputSchema = z.object({
  deviceName: z.string().describe('The name of the device, e.g., "iPhone 11 Pro".'),
  problemDescription: z.string().describe('A user-written description of the problem, e.g., "The screen is cracked and won\'t turn on."'),
});
export type RepairAdviceInput = z.infer<typeof RepairAdviceInputSchema>;

const RepairAdviceOutputSchema = z.object({
  probableIssue: z.string().describe("A summary of the most likely technical problem, e.g., 'Broken display assembly and possibly damaged digitizer.'"),
  repairability: z.string().describe("An assessment of how repairable the issue is (e.g., 'High', 'Medium', 'Low')."),
  estimatedCostRange: z.string().describe("The estimated repair cost range in Indian Rupees, e.g., '₹4,000 - ₹6,500'."),
  suggestedAction: z.string().describe("A recommended next step for the user, e.g., 'This is a common repair. We recommend getting a quote from a certified technician.'"),
});
export type RepairAdviceOutput = z.infer<typeof RepairAdviceOutputSchema>;


export async function getRepairAdvice(
  input: RepairAdviceInput
): Promise<RepairAdviceOutput> {
  return repairAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'repairAdvisorPrompt',
  input: { schema: RepairAdviceInputSchema },
  output: { schema: RepairAdviceOutputSchema },
  prompt: `You are an expert electronics repair technician for ReCycleConnect, an Indian marketplace. Your task is to diagnose a problem with an electronic device based on the user's description and provide a realistic repair assessment.

Device Name: {{{deviceName}}}
Problem Description: {{{problemDescription}}}

Based on the description, provide the following:
1.  **Probable Issue**: What is the most likely technical fault? Be specific.
2.  **Repairability**: How easy or difficult is this repair? (High, Medium, Low).
3.  **Estimated Cost Range**: Provide a realistic cost range for this repair in Indian Rupees (₹).
4.  **Suggested Action**: Advise the user on their best next step.

Provide your response in the specified JSON format.
`,
});

const repairAdvisorFlow = ai.defineFlow(
  {
    name: 'repairAdvisorFlow',
    inputSchema: RepairAdviceInputSchema,
    outputSchema: RepairAdviceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
