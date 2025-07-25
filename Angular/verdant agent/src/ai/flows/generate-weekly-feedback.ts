'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating weekly feedback based on user-provided KPI data.
 *
 * The flow takes in weekly KPI data and uses the Gemini Pro model to evaluate performance trends
 * and provide AI-generated feedback. The feedback is tailored to help users understand their
 * progress and identify areas for improvement.
 *
 * @interface GenerateWeeklyFeedbackInput - Defines the input schema for the flow.
 * @interface GenerateWeeklyFeedbackOutput - Defines the output schema for the flow.
 * @function generateWeeklyFeedback - The main function that triggers the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWeeklyFeedbackInputSchema = z.object({
  industry: z.string().describe('The industry of the user.'),
  goal: z.string().describe('The selected ESG goal of the user.'),
  weeklyKpiData: z
    .string()
    .describe(
      'A string containing the weekly KPI data. This can be manually input or from a CSV upload.'
    ),
  previousFeedback: z
    .string()
    .optional()
    .describe('The previous feedback given to the user, if any.'),
});

export type GenerateWeeklyFeedbackInput = z.infer<
  typeof GenerateWeeklyFeedbackInputSchema
>;

const GenerateWeeklyFeedbackOutputSchema = z.object({
  feedback: z.string().describe('The AI-generated feedback on the user performance.'),
});

export type GenerateWeeklyFeedbackOutput = z.infer<
  typeof GenerateWeeklyFeedbackOutputSchema
>;

export async function generateWeeklyFeedback(
  input: GenerateWeeklyFeedbackInput
): Promise<GenerateWeeklyFeedbackOutput> {
  return generateWeeklyFeedbackFlow(input);
}

const generateWeeklyFeedbackPrompt = ai.definePrompt({
  name: 'generateWeeklyFeedbackPrompt',
  input: {schema: GenerateWeeklyFeedbackInputSchema},
  output: {schema: GenerateWeeklyFeedbackOutputSchema},
  prompt: `You are an AI sustainability coach providing feedback to users on their ESG goal progress.

  The user is in the {{{industry}}} industry and is focused on the goal: {{{goal}}}.

  Here is their weekly KPI data:
  {{{weeklyKpiData}}}

  {{#if previousFeedback}}Here is the previous feedback you provided:
  {{{previousFeedback}}}{{/if}}

  Evaluate their performance trends based on the weekly KPI data and provide constructive feedback.
  Highlight improvements and areas where they can improve further.
  Make sure the feedback is tailored to their specific industry and goal.
  Be encouraging and supportive in your feedback.
`,
});

const generateWeeklyFeedbackFlow = ai.defineFlow(
  {
    name: 'generateWeeklyFeedbackFlow',
    inputSchema: GenerateWeeklyFeedbackInputSchema,
    outputSchema: GenerateWeeklyFeedbackOutputSchema,
    retry: {
      maxAttempts: 10,
      backoff: {
        duration: '15s',
        multiplier: 2,
      },
    },
  },
  async input => {
    const {output} = await generateWeeklyFeedbackPrompt(input);
    return output!;
  }
);
