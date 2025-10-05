
'use server';

/**
 * @fileOverview Converts geographic coordinates to a locality slug.
 * 
 * - getLocalityFromCoordinates - A function that takes latitude and longitude and returns a locality slug.
 * - GetLocalityInput - The input type for the getLocalityFromCoordinates function.
 * - GetLocalityOutput - The return type for the getLocalityFromCoordinates function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetLocalityInputSchema = z.object({
  latitude: z.number().describe('The latitude coordinate.'),
  longitude: z.number().describe('The longitude coordinate.'),
});
export type GetLocalityInput = z.infer<typeof GetLocalityInputSchema>;


const GetLocalityOutputSchema = z.object({
  locality: z.string().optional().describe("The locality slug, e.g., 'kothrud', 'viman-nagar'."),
  error: z.string().optional().describe("An error message if the locality could not be determined.")
});
export type GetLocalityOutput = z.infer<typeof GetLocalityOutputSchema>;


export async function getLocalityFromCoordinates(
  input: GetLocalityInput
): Promise<GetLocalityOutput> {
  return getLocalityFromCoordinatesFlow(input);
}


// A simplified tool to "look up" coordinates. In a real app, this would
// make a call to a service like Google Maps Geocoding API.
const getAddressFromCoordinatesTool = ai.defineTool(
    {
        name: 'getAddressFromCoordinates',
        description: 'Gets address information for a given latitude and longitude.',
        inputSchema: GetLocalityInputSchema,
        outputSchema: z.object({
            // This simulates a partial response from a geocoding API
            locality: z.string().describe("The neighborhood or locality, e.g., 'Kothrud', 'Hinjawadi'"),
            city: z.string().describe("The city, e.g., 'Pune'"),
        }),
    },
    async ({ latitude, longitude }) => {
        // This is a MOCK implementation. A real implementation would call an external API.
        // The logic simulates a reverse geocoder for Pune, India area for demo purposes.
        console.log(`[Tool] Reverse geocoding for ${latitude}, ${longitude}`);
        if (latitude > 18.55 && latitude < 18.63 && longitude > 73.75 && longitude < 73.85) {
            return { locality: 'Hinjawadi', city: 'Pune' };
        }
        if (latitude > 18.50 && latitude < 18.53 && longitude > 73.80 && longitude < 73.84) {
            return { locality: 'Kothrud', city: 'Pune' };
        }
        if (latitude > 18.53 && latitude < 18.56 && longitude > 73.90 && longitude < 73.94) {
            return { locality: 'Viman Nagar', city: 'Pune' };
        }
        // Default fallback
        return { locality: 'Deccan Gymkhana', city: 'Pune' };
    }
);


const prompt = ai.definePrompt({
    name: 'getLocalityPrompt',
    input: { schema: GetLocalityInputSchema },
    output: { schema: GetLocalityOutputSchema },
    tools: [getAddressFromCoordinatesTool],
    prompt: `
        The user has provided their geographic coordinates.
        1. Use the getAddressFromCoordinates tool to find the address for the given latitude and longitude.
        2. From the tool's output, identify the locality.
        3. Convert the locality name into a URL-friendly slug format (lowercase, replace spaces with hyphens). For example, 'Viman Nagar' becomes 'viman-nagar'.
        4. Set the 'locality' field in your output to this slug.
        5. If the tool fails or you cannot determine a locality, set the 'error' field with an appropriate message.
    `
});

const getLocalityFromCoordinatesFlow = ai.defineFlow(
  {
    name: 'getLocalityFromCoordinatesFlow',
    inputSchema: GetLocalityInputSchema,
    outputSchema: GetLocalityOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
