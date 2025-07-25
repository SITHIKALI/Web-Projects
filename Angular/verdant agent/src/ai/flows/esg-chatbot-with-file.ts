'use server';

/**
 * @fileOverview Defines a Genkit flow for an AI-powered ESG chatbot that can process file uploads.
 *
 * This flow provides an expert conversational AI that can answer questions about
 * sustainability goals, ESG strategies, and compliance, using the content of a
 * provided file as additional context.
 *
 * @interface EsgChatbotWithFileInput - The input type for the chatbot function.
 * @interface EsgChatbotWithFileOutput - The output type for the chatbot function.
 * @function askEsgChatbotWithFile - The main function to interact with the chatbot.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EsgChatbotWithFileInputSchema = z.object({
  query: z.string().describe("The user's question for the ESG chatbot."),
  fileDataUri: z
    .string()
    .describe(
      "The content of the uploaded file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  history: z
    .array(z.object({role: z.enum(['user', 'model']), content: z.string()}))
    .optional()
    .describe('The previous conversation history.'),
});
export type EsgChatbotWithFileInput = z.infer<typeof EsgChatbotWithFileInputSchema>;

const EsgChatbotWithFileOutputSchema = z.object({
  response: z.string().describe("The chatbot's response to the user's query."),
});
export type EsgChatbotWithFileOutput = z.infer<typeof EsgChatbotWithFileOutputSchema>;

export async function askEsgChatbotWithFile(
  input: EsgChatbotWithFileInput
): Promise<EsgChatbotWithFileOutput> {
  return esgChatbotWithFileFlow(input);
}

const chatbotPrompt = ai.definePrompt({
  name: 'esgChatbotWithFilePrompt',
  input: {schema: EsgChatbotWithFileInputSchema},
  output: {schema: EsgChatbotWithFileOutputSchema},
  prompt: `You are "Verdant Path", a smart and friendly ESG & Sustainability assistant. Your job is to help users understand, plan, and improve their Environmental, Social, and Governance (ESG) strategies.

  The user has uploaded a file to provide additional context for their query. Use the content of this file to inform your response.

  File Content:
  {{media url=fileDataUri}}

  Your Capabilities:
  - Analyze the provided file content in conjunction with the user's query.
  - Clear explanations of ESG frameworks like GRI, SASB, TCFD.
  - Suggestions for sustainability goals based on industry.
  - Definitions of terms like Net Zero, Carbon Footprint, Scope 1-3 emissions, Circular Economy, etc.
  - Polite guidance when users go off-topic.

  Protocols for Restricted or Out-of-Scope Queries:
  - If a user asks technical/development-related questions (e.g., "How to change the source code?"):
    Reply with: "I'm here to assist with sustainability and ESG-related questions. For technical assistance, please contact the development team."
  - If a user asks about confidential or private data that isn't in the provided file:
    Deny access and redirect with: "I can only answer questions based on the information you provide in your query and file uploads. I cannot access private or confidential information."

  {{#if history}}
  Conversation history:
  {{#each history}}
  {{#ifEquals role 'user'}}User: {{content}}{{/ifEquals}}
  {{#ifEquals role 'model'}}You: {{content}}{{/ifEquals}}
  {{/each}}
  {{/if}}

  User's new question: {{{query}}}
  Your response:`,
});

const esgChatbotWithFileFlow = ai.defineFlow(
  {
    name: 'esgChatbotWithFileFlow',
    inputSchema: EsgChatbotWithFileInputSchema,
    outputSchema: EsgChatbotWithFileOutputSchema,
    retry: {
      maxAttempts: 10,
      backoff: {
        duration: '15s',
        multiplier: 2,
      },
    },
  },
  async input => {
    const {output} = await chatbotPrompt(input);
    return output!;
  }
);
