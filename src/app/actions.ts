
"use server"

import { suggestItemCategory } from "@/ai/flows/suggest-item-category";
import { getLocalityFromCoordinates } from "@/ai/flows/get-locality-from-coords";
import { translateText } from "@/ai/flows/translate-text";
import { evaluateDevice } from "@/ai/flows/device-valuator-flow";
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


const TranslateTextSchema = z.object({
    text: z.string(),
    targetLanguage: z.string(),
});

export async function handleTranslateText(text: string, targetLanguage: string) {
    try {
        const validatedFields = TranslateTextSchema.safeParse({ text, targetLanguage });

        if (!validatedFields.success) {
            return { error: "Invalid input for translation." };
        }
        
        const result = await translateText(validatedFields.data);
        return { translation: result.translation };
    } catch (e) {
        console.error(e);
        // Don't return the original text on failure, let the UI handle it.
        return { error: "Translation failed." };
    }
}

const EvaluateDeviceSchema = z.object({
  deviceName: z.string().min(3, "Device name is required."),
  images: z.array(z.string().startsWith("data:image/")).min(1, "At least one image is required."),
});

export async function handleDeviceValuation(deviceName: string, images: string[]) {
  try {
    const validatedFields = EvaluateDeviceSchema.safeParse({ deviceName, images });

    if (!validatedFields.success) {
      // For a more detailed error, you could format validatedFields.error.issues
      return { error: "Invalid input: Please provide a device name and at least one image." };
    }

    const result = await evaluateDevice(validatedFields.data);
    return { valuation: result };
  } catch (e) {
    console.error(e);
    return { error: "Failed to get valuation. Please try again." };
  }
}
