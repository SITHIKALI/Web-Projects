
'use server';

/**
 * @fileOverview Defines a Genkit flow for extracting ESG insights from an uploaded report.
 *
 * This flow analyzes a user-provided document (e.g., a text-based ESG report)
 * to identify key metrics, trends, and anomalies, and then generates actionable
 * recommendations. The output is structured for easy display in UI components
 * like cards and charts.
 *
 * @interface KeyMetric - The structure for a single key metric extracted from the report.
 * @interface GenerateInsightsFromReportInput - The input type for the main function.
 * @interface GenerateInsightsFromReportOutput - The output type for the main function.
 * @function generateInsightsFromReport - The main function to trigger the insight generation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightsFromReportInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "The content of the uploaded ESG report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateInsightsFromReportInput = z.infer<
  typeof GenerateInsightsFromReportInputSchema
>;

const KeyMetricSchema = z.object({
  name: z.string().describe('The name of the metric (e.g., "CO2 Emissions", "Water Usage").'),
  value: z.number().describe('The numerical value of the metric.'),
  unit: z.string().describe('The unit of the metric (e.g., "tons", "cubic meters").'),
});
export type KeyMetric = z.infer<typeof KeyMetricSchema>;

const GenerateInsightsFromReportOutputSchema = z.object({
  summary: z.string().describe('A high-level, one-paragraph summary of the report\'s key findings.'),
  positiveTrends: z
    .array(z.string())
    .describe('A list of 2-3 significant positive trends or achievements found in the report.'),
  anomalies: z
    .array(z.string())
    .describe(
      'A list of 2-3 notable anomalies, risks, or areas needing attention identified in the report.'
    ),
  keyMetrics: z
    .array(KeyMetricSchema)
    .describe(
      'An array of 3-5 of the most important quantitative metrics extracted from the report, suitable for charting.'
    ),
  suggestions: z
    .array(z.string())
    .describe(
      'A list of 2-3 concrete, actionable recommendations based on the report\'s findings.'
    ),
});
export type GenerateInsightsFromReportOutput = z.infer<
  typeof GenerateInsightsFromReportOutputSchema
>;

export async function generateInsightsFromReport(
  input: GenerateInsightsFromReportInput
): Promise<GenerateInsightsFromReportOutput> {
  return generateInsightsFromReportFlow(input);
}

const insightsPrompt = ai.definePrompt({
  name: 'generateInsightsFromReportPrompt',
  input: {schema: GenerateInsightsFromReportInputSchema},
  output: {schema: GenerateInsightsFromReportOutputSchema},
  prompt: `You are an expert ESG analyst AI. Your task is to analyze the provided ESG report content and extract structured insights.

  Report Content:
  {{media url=fileDataUri}}

  Analyze the document and provide the following, in a structured format:
  1.  **Summary:** Write a concise, one-paragraph summary of the main takeaways from the report.
  2.  **Positive Trends:** Identify 2-3 key achievements or positive trends. These should be specific and impactful (e.g., "Reduced Scope 1 emissions by 15% year-over-year").
  3.  **Anomalies:** Identify 2-3 areas of concern, risks, or negative trends that require attention (e.g., "Water consumption increased by 8% despite conservation initiatives").
  4.  **Key Metrics:** Extract the 3-5 most critical quantitative data points from the report. For each metric, provide its name, a numerical value, and its unit. Focus on core ESG indicators like emissions, energy, water, waste, and safety incidents.
  5.  **Suggestions:** Based on your analysis, provide 2-3 actionable recommendations for the company to improve its ESG performance. These should be practical and directly related to the findings in the report.
  `,
});

const generateInsightsFromReportFlow = ai.defineFlow(
  {
    name: 'generateInsightsFromReportFlow',
    inputSchema: GenerateInsightsFromReportInputSchema,
    outputSchema: GenerateInsightsFromReportOutputSchema,
    retry: {
      maxAttempts: 3,
      backoff: {
        duration: '10s',
        multiplier: 2,
      },
    },
  },
  async input => {
    const {output} = await insightsPrompt(input);
    return output!;
  }
);
