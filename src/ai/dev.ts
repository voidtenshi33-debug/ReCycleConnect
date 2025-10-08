
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-item-category.ts';
import '@/ai/flows/get-locality-from-coords.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/device-valuator-flow.ts';
import '@/ai/flows/generate-description-flow.ts';
import '@/ai/flows/generate-title-flow.ts';
import '@/ai/flows/repair-advisor-flow.ts';
import '@/ai/flows/compatibility-checker-flow.ts';
import '@/ai/flows/generate-problem-description-flow.ts';
import '@/ai/flows/generate-part-description-flow.ts';
