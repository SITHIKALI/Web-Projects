'use server';

/**
 * @fileOverview Defines a Genkit flow for an AI-powered ESG chatbot.
 *
 * This flow provides an expert conversational AI that can answer questions about
 * sustainability goals, ESG strategies, and compliance.
 *
 * @interface EsgChatbotInput - The input type for the chatbot function.
 * @interface EsgChatbotOutput - The output type for the chatbot function.
 * @function askEsgChatbot - The main function to interact with the chatbot.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EsgChatbotInputSchema = z.object({
  query: z.string().describe("The user's question for the ESG chatbot."),
  history: z
    .array(z.object({role: z.enum(['user', 'model']), content: z.string()}))
    .optional()
    .describe('The previous conversation history.'),
});
export type EsgChatbotInput = z.infer<typeof EsgChatbotInputSchema>;

const EsgChatbotOutputSchema = z.object({
  response: z.string().describe("The chatbot's response to the user's query."),
});
export type EsgChatbotOutput = z.infer<typeof EsgChatbotOutputSchema>;

export async function askEsgChatbot(input: EsgChatbotInput): Promise<EsgChatbotOutput> {
  return esgChatbotFlow(input);
}

const chatbotPrompt = ai.definePrompt({
  name: 'esgChatbotPrompt',
  input: {schema: EsgChatbotInputSchema},
  output: {schema: EsgChatbotOutputSchema},
  prompt: `You are "Verdant Path", a smart and friendly ESG & Sustainability assistant. Your job is to help users understand, plan, and improve their Environmental, Social, and Governance (ESG) strategies.

  Your Capabilities:
  - Clear explanations of ESG frameworks like GRI, SASB, TCFD
  - Suggestions for sustainability goals based on industry
  - Definitions of terms like Net Zero, Carbon Footprint, Scope 1-3 emissions, Circular Economy, etc.
  - Polite guidance when users go off-topic or ask for code access

  Protocols for Restricted or Out-of-Scope Queries:
  - If a user asks technical/development-related questions (e.g., "How to change the source code?", "Can I access your backend?", "Show me how to build you?"):
    Reply with: "I'm here to assist with sustainability and ESG-related questions. For technical assistance or code-related queries, please contact the development team or platform administrator. I appreciate your interest!"
    Tone: Apologetic, professional, and non-revealing.
  - If a user submits unrelated queries (like jokes, casual chat, or abuse):
    Politely redirect with: "I specialize in helping users with ESG and sustainability-related questions. How may I assist you in that area today?"
  - If a user asks about confidential or private data (e.g., company-specific audit results):
    Deny access and redirect to general advice with: "I'm unable to access private or confidential information. However, I can help you understand ESG audit processes or best practices."
  - If a user asks for legal or compliance-specific advice:
    Include a disclaimer: "I can provide general ESG compliance information, but for legal or regulatory advice, please consult a certified expert or legal team."

  Interaction Style:
  - Friendly, informative, and focused on environmental and corporate responsibility.
  - Always maintain data privacy and stay within scope.
  - DO NOT mention courses, learning, or certifications unless explicitly asked.

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

const esgChatbotFlow = ai.defineFlow(
  {
    name: 'esgChatbotFlow',
    inputSchema: EsgChatbotInputSchema,
    outputSchema: EsgChatbotOutputSchema,
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
