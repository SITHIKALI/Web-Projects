// This is a Genkit flow file.

'use server';

/**
 * @fileOverview ESG goal suggestion flow.
 *
 * This file defines a Genkit flow that suggests relevant ESG goals based on the user's industry
 * and, optionally, a specific material topic.
 *
 * @remarks
 * - suggestRelevantEsgGoals - A function that suggests relevant ESG goals.
 * - SuggestRelevantEsgGoalsInput - The input type for the suggestRelevantEsgGoals function.
 * - SuggestRelevantEsgGoalsOutput - The return type for the suggestRelevantEsgGoals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantEsgGoalsInputSchema = z.object({
  industry: z
    .string()
    .describe("The industry for which to suggest ESG goals (e.g., 'Manufacturing', 'Retail', 'IT')."),
  language: z.string().optional().describe("The language for the suggested goals (e.g., 'en', 'es', 'hi')."),
  materialTopic: z
    .string()
    .optional()
    .describe(
      'A specific material topic to focus on when suggesting goals (e.g., "Water Scarcity").'
    ),
});
export type SuggestRelevantEsgGoalsInput = z.infer<typeof SuggestRelevantEsgGoalsInputSchema>;

const SuggestRelevantEsgGoalsOutputSchema = z.object({
  goals: z
    .array(z.string())
    .describe('An array of relevant ESG goals suggested for the given industry and topic.'),
});
export type SuggestRelevantEsgGoalsOutput = z.infer<typeof SuggestRelevantEsgGoalsOutputSchema>;

export async function suggestRelevantEsgGoals(
  input: SuggestRelevantEsgGoalsInput
): Promise<SuggestRelevantEsgGoalsOutput> {
  return suggestRelevantEsgGoalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantEsgGoalsPrompt',
  input: {schema: SuggestRelevantEsgGoalsInputSchema},
  output: {schema: SuggestRelevantEsgGoalsOutputSchema},
  prompt: `You are an expert in Environmental, Social, and Governance (ESG) principles.

  Based on the industry provided by the user, suggest 3-5 relevant ESG goals that the user can adopt.

  {{#if materialTopic}}
  The user is particularly interested in the material topic: '{{{materialTopic}}}'. Your suggested goals MUST be directly related to this topic within the specified industry.
  {{else}}
  Provide general, high-impact ESG goals suitable for the industry.
  {{/if}}

  VERY IMPORTANT: Generate the goals in the following language: {{{language}}}. If no language is provided, default to English.

  Industry: {{{industry}}}
  {{#if materialTopic}}
  Material Topic: {{{materialTopic}}}
  {{/if}}
  Goals:`,
});

const suggestRelevantEsgGoalsFlow = ai.defineFlow(
  {
    name: 'suggestRelevantEsgGoalsFlow',
    inputSchema: SuggestRelevantEsgGoalsInputSchema,
    outputSchema: SuggestRelevantEsgGoalsOutputSchema,
    retry: {
      maxAttempts: 10,
      backoff: {
        duration: '15s',
        multiplier: 2,
      },
    },
  },
  async input => {
    const {output} = await prompt(input);
    const goals = output!.goals;
    return {goals};
  }
);
