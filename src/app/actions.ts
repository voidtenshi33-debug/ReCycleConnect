
"use server"

import { suggestItemCategory } from "@/ai/flows/suggest-item-category";
import { getLocalityFromCoordinates } from "@/ai/flows/get-locality-from-coords";
import { z } from "zod";

const SuggestCategorySchema = z.object({
  photoDataUri: z.string().startsWith("data:image/"),
});

export async function handleSuggestCategory(formData: FormData) {
  try {
    const validatedFields = SuggestCategorySchema.safeParse({
      photoDataUri: formData.get('photoDataUri'),
    });

    if (!validatedFields.success) {
      return { error: "Invalid image data." };
    }

    const { photoDataUri } = validatedFields.data;
    const result = await suggestItemCategory({ photoDataUri });
    
    return { suggestions: result.suggestedCategories };
  } catch (e) {
    console.error(e);
    return { error: "Failed to get suggestions. Please try again." };
  }
}

const GetLocalitySchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export async function handleGetLocality(latitude: number, longitude: number) {
  try {
    const validatedFields = GetLocalitySchema.safeParse({
      latitude,
      longitude,
    });

    if (!validatedFields.success) {
      return { error: "Invalid coordinates." };
    }

    const result = await getLocalityFromCoordinates(validatedFields.data);
    
    if (result.error) {
      return { error: result.error };
    }
    
    return { locality: result.locality };
  } catch (e) {
    console.error(e);
    return { error: "Failed to get locality. Please try again." };
  }
}
