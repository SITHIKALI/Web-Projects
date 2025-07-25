'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-improvements.ts';
import '@/ai/flows/esg-goal-suggestion.ts';
import '@/ai/flows/generate-goal-explanation.ts';
import '@/ai/flows/generate-weekly-feedback.ts';
import '@/ai/flows/esg-chatbot.ts';
import '@/ai/flows/esg-chatbot-with-file.ts';
import '@/ai/flows/generate-esg-report.ts';
import '@/ai/flows/generate-case-studies.ts';
import '@/ai/flows/get-material-topics.ts';
import '@/ai/flows/generate-insights-from-report.ts';
