'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating explanations for selected ESG goals.
 *
 * The flow takes an ESG goal as input and returns a detailed explanation, including its importance,
 * example KPIs, and success stories related to the industry.
 *
 * @interface GenerateGoalExplanationInput - Input type for the generateGoalExplanation function.
 * @interface GenerateGoalExplanationOutput - Output type for the generateGoalexplanation function.
 * @function generateGoalExplanation - The main function to generate the ESG goal explanation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGoalExplanationInputSchema = z.object({
  industry: z.string().describe('The industry to tailor the ESG explanation to.'),
  goal: z.string().describe('The ESG goal to explain.'),
});
export type GenerateGoalExplanationInput = z.infer<
  typeof GenerateGoalExplanationInputSchema
>;

const GenerateGoalExplanationOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the ESG goal.'),
  importance: z.string().describe('Why the ESG goal is important.'),
  kpis: z.string().describe('Example KPIs for the ESG goal.'),
  successStories: z
    .string()
    .describe('Success stories related to the ESG goal in the specified industry.'),
});
export type GenerateGoalExplanationOutput = z.infer<
  typeof GenerateGoalExplanationOutputSchema
>;

export async function generateGoalExplanation(
  input: GenerateGoalExplanationInput
): Promise<GenerateGoalExplanationOutput> {
  return generateGoalExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGoalExplanationPrompt',
  input: {schema: GenerateGoalExplanationInputSchema},
  output: {schema: GenerateGoalExplanationOutputSchema},
  prompt: `You are an expert in Environmental, Social, and Governance (ESG) principles.
  Your task is to provide a comprehensive explanation of a given ESG goal within a specific industry.

  Industry: {{{industry}}}
  ESG Goal: {{{goal}}}

  Explanation:
  Provide a detailed explanation of the ESG goal, including its definition and scope.

  Importance:
  Explain why this ESG goal is important for the specified industry.  Include environmental, social, and governance factors.

  Example KPIs:
  Suggest key performance indicators (KPIs) that can be used to measure progress toward achieving the ESG goal. **Return this as a single, unformatted paragraph of text, not a bulleted list.**

  Success Stories:
  Describe specific success stories of companies in the {{{industry}}} industry that have effectively implemented this ESG goal.
  Focus on quantifiable achievements and the positive impact on their operations and reputation.
`,
});

const generateGoalExplanationFlow = ai.defineFlow(
  {
    name: 'generateGoalExplanationFlow',
    inputSchema: GenerateGoalExplanationInputSchema,
    outputSchema: GenerateGoalExplanationOutputSchema,
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
