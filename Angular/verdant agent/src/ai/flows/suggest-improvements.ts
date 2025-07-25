'use server';

/**
 * @fileOverview Suggests specific tools, policies, or process improvements tailored to the user's selected goals.
 *
 * - suggestImprovements - A function that handles the suggestion of improvements for sustainability performance.
 * - SuggestImprovementsInput - The input type for the suggestImprovements function.
 * - SuggestImprovementsOutput - The return type for the suggestImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestImprovementsInputSchema = z.object({
  industry: z.string().describe('The industry of the user.'),
  selectedGoal: z.string().describe('The ESG goal selected by the user.'),
});
export type SuggestImprovementsInput = z.infer<typeof SuggestImprovementsInputSchema>;

const SuggestImprovementsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggested tools, policies, or process improvements.'),
});
export type SuggestImprovementsOutput = z.infer<typeof SuggestImprovementsOutputSchema>;

export async function suggestImprovements(input: SuggestImprovementsInput): Promise<SuggestImprovementsOutput> {
  return suggestImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestImprovementsPrompt',
  input: {schema: SuggestImprovementsInputSchema},
  output: {schema: SuggestImprovementsOutputSchema},
  prompt: `You are an AI assistant helping users improve their sustainability performance.

You will be provided with the user's industry and their selected ESG goal. Based on this information, you will suggest specific tools, policies, or process improvements that the user can implement to achieve their goal.

Industry: {{{industry}}}
Selected Goal: {{{selectedGoal}}}

Suggestions:`,
});

const suggestImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestImprovementsFlow',
    inputSchema: SuggestImprovementsInputSchema,
    outputSchema: SuggestImprovementsOutputSchema,
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
    return output!;
  }
);
