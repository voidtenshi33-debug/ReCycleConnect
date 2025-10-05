
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-item-category.ts';
import '@/ai/flows/get-locality-from-coords.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/device-valuator-flow.ts';
import '@/ai/flows/generate-description-flow.ts';
