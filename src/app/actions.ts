"use server"

import { suggestItemCategory } from "@/ai/flows/suggest-item-category";
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
