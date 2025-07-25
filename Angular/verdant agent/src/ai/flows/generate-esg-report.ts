'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a comprehensive ESG report.
 *
 * The flow analyzes a user's weekly KPI data for a specific goal and industry, then generates
 * a structured report summarizing their performance.
 *
 * @interface GenerateEsgReportInput - Input type for the generateEsgReport function.
 * @interface GenerateEsgReportOutput - Output type for the generateEsgReport function.
 * @function generateEsgReport - The main function to generate the ESG report.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEsgReportInputSchema = z.object({
  industry: z.string().describe('The industry the user is in.'),
  goal: z.string().describe('The ESG goal the user is focused on.'),
  allWeeklyData: z
    .array(
      z.object({
        week: z.number(),
        kpiInput: z.string(),
        feedback: z.string(),
      })
    )
    .describe('An array of all the weekly data logged by the user.'),
});
export type GenerateEsgReportInput = z.infer<typeof GenerateEsgReportInputSchema>;

const GenerateEsgReportOutputSchema = z.object({
  overview: z.string().describe('A high-level overview of the performance.'),
  areasForAttention: z
    .string()
    .describe('Specific areas where performance is lagging or needs attention.'),
  positiveImprovements: z
    .string()
    .describe('Highlights of positive trends and improvements.'),
  actionPoints: z
    .string()
    .describe('A list of concrete, actionable steps the user can take to improve.'),
});
export type GenerateEsgReportOutput = z.infer<typeof GenerateEsgReportOutputSchema>;

export async function generateEsgReport(
  input: GenerateEsgReportInput
): Promise<GenerateEsgReportOutput> {
  return generateEsgReportFlow(input);
}

const reportPrompt = ai.definePrompt({
  name: 'generateEsgReportPrompt',
  input: {schema: GenerateEsgReportInputSchema},
  output: {schema: GenerateEsgReportOutputSchema},
  prompt: `You are an expert ESG analyst. Your task is to generate a performance report based on the user's weekly data.

  The user is in the '{{{industry}}}' industry, focusing on the goal: '{{{goal}}}'.

  Here is all their logged data:
  {{#each allWeeklyData}}
  Week {{week}}:
  - Data: {{kpiInput}}
  - Previous AI Feedback: {{feedback}}
  {{/each}}

  Based on this data, provide a structured ESG performance report. Analyze the trends, consistency, and progress over the weeks.

  **Overview:** Provide a high-level summary of the overall performance trend.
  **Positive Improvements:** Highlight what the user has done well and which metrics are improving.
  **Areas for Attention:** Identify any metrics that are stagnant, declining, or require more focus.
  **Suggested Action Points:** Provide a short list of clear, actionable steps the user can take to improve their performance in the next period.
  `,
});

const generateEsgReportFlow = ai.defineFlow(
  {
    name: 'generateEsgReportFlow',
    inputSchema: GenerateEsgReportInputSchema,
    outputSchema: GenerateEsgReportOutputSchema,
    retry: {
      maxAttempts: 10,
      backoff: {
        duration: '15s',
        multiplier: 2,
      },
    },
  },
  async input => {
    const {output} = await reportPrompt(input);
    return output!;
  }
);
