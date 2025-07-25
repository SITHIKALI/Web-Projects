
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating up-to-date ESG case studies.
 *
 * The flow leverages an AI model to provide recent, real-world examples of ESG strategies
 * from leading global companies.
 *
 * @interface CaseStudy - The structure for a single case study.
 * @interface GenerateCaseStudiesOutput - The output type for the generateCaseStudies function.
 * @function generateCaseStudies - The main function to generate the ESG case studies.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CaseStudySchema = z.object({
  companyName: z.string().describe('The name of the company in the case study.'),
  summary: z
    .string()
    .describe(
      'A detailed summary of the company\'s ESG strategy, initiatives, measurable outcomes, and key learnings. This should be several paragraphs long.'
    ),
});
export type CaseStudy = z.infer<typeof CaseStudySchema>;

const GenerateCaseStudiesOutputSchema = z.object({
  caseStudies: z.array(CaseStudySchema).describe('A list of 3-4 recent and relevant ESG case studies.'),
});
export type GenerateCaseStudiesOutput = z.infer<typeof GenerateCaseStudiesOutputSchema>;

export async function generateCaseStudies(): Promise<GenerateCaseStudiesOutput> {
  return generateCaseStudiesFlow();
}

const prompt = ai.definePrompt({
  name: 'generateCaseStudiesPrompt',
  output: {schema: GenerateCaseStudiesOutputSchema},
  prompt: `You are an expert ESG analyst. Your task is to provide a list of 3-4 recent and insightful real-world case studies of companies implementing successful ESG strategies.

For each case study, provide the following:
1.  **Company Name:** The name of the company.
2.  **Summary:** A detailed summary covering their strategy, specific initiatives, and measurable outcomes. Explain why their approach was successful and what key learnings other businesses can take away. Mention any key frameworks they aligned with (e.g., GRI, TCFD, SDGs). Ensure the information is as up-to-date as possible.

Provide a diverse set of examples from different industries.
`,
});

const generateCaseStudiesFlow = ai.defineFlow(
  {
    name: 'generateCaseStudiesFlow',
    outputSchema: GenerateCaseStudiesOutputSchema,
    retry: {
      maxAttempts: 10,
      backoff: {
        duration: '15s',
        multiplier: 2,
      },
    },
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
