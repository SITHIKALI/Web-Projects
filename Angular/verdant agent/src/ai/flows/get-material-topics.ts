'use server';

/**
 * @fileOverview This file defines a Genkit flow for identifying material ESG topics.
 *
 * The flow takes an industry as input and returns a list of the most critical
 * Environmental, Social, and Governance topics for that sector, along with brief explanations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetMaterialTopicsInputSchema = z.object({
  industry: z.string().describe('The industry to identify material topics for.'),
});
export type GetMaterialTopicsInput = z.infer<typeof GetMaterialTopicsInputSchema>;

const MaterialTopicSchema = z.object({
  topic: z.string().describe('The name of the material ESG topic (e.g., "Water Scarcity").'),
  explanation: z
    .string()
    .describe('A brief, clear explanation of why this topic is material to the given industry.'),
});

const GetMaterialTopicsOutputSchema = z.object({
  topics: z
    .array(MaterialTopicSchema)
    .describe(
      'An array of 4-5 of the most critical material ESG topics for the specified industry.'
    ),
});
export type GetMaterialTopicsOutput = z.infer<typeof GetMaterialTopicsOutputSchema>;

export async function getMaterialTopics(
  input: GetMaterialTopicsInput
): Promise<GetMaterialTopicsOutput> {
  return getMaterialTopicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getMaterialTopicsPrompt',
  input: {schema: GetMaterialTopicsInputSchema},
  output: {schema: GetMaterialTopicsOutputSchema},
  prompt: `You are an expert ESG analyst. Your task is to identify the most critical material topics for a given industry.

A "material topic" is an ESG issue that has a direct and significant impact on a company's financial performance, operations, and long-term value creation within a specific industry.

For the industry '{{{industry}}}', identify the 4-5 most pressing material topics. For each topic, provide a brief explanation of why it is significant for that industry. Focus on the most impactful and relevant issues.`,
});

const getMaterialTopicsFlow = ai.defineFlow(
  {
    name: 'getMaterialTopicsFlow',
    inputSchema: GetMaterialTopicsInputSchema,
    outputSchema: GetMaterialTopicsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
