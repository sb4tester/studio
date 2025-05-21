'use server';

/**
 * @fileOverview Generates a personalized fortune based on the user's past readings, providing interpretation and recommendations.
 *
 * - generateFortune - A function that generates personalized fortunes.
 * - GenerateFortuneInput - The input type for the generateFortune function.
 * - GenerateFortuneOutput - The return type for the generateFortune function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFortuneInputSchema = z.object({
  pastReadings: z
    .array(z.string())
    .describe('รายการผลคำทำนายที่ผ่านมาของผู้ใช้'),
  userQuery: z.string().describe('คำถามหรือบริบทเฉพาะจากผู้ใช้'),
});
export type GenerateFortuneInput = z.infer<typeof GenerateFortuneInputSchema>;

const GenerateFortuneOutputSchema = z.object({
  fortune: z.string().describe('คำทำนายที่สร้างขึ้น'),
  interpretation: z.string().describe('การตีความคำทำนาย'),
  recommendations: z.string().describe('คำแนะนำส่วนบุคคลตามคำทำนาย ผลการอ่านที่ผ่านมา และคำถามของผู้ใช้'),
});
export type GenerateFortuneOutput = z.infer<typeof GenerateFortuneOutputSchema>;

export async function generateFortune(input: GenerateFortuneInput): Promise<GenerateFortuneOutput> {
  return generateFortuneFlow(input);
}

const fortunePrompt = ai.definePrompt({
  name: 'fortunePrompt',
  input: {schema: GenerateFortuneInputSchema},
  output: {schema: GenerateFortuneOutputSchema},
  prompt: `You are a wise seer, skilled in interpreting fortunes and providing personalized guidance.

  Based on the user's past readings and current context, generate a new fortune, interpret its meaning,
  and provide tailored recommendations. Consider the user's history to offer unique insights.

  Past Readings:
  {{#if pastReadings}}
  {{#each pastReadings}}
  - {{{this}}}
  {{/each}}
  {{else}}
  No past readings available.
  {{/if}}

  User Query: {{{userQuery}}}

  Fortune:
  Interpretation:
  Recommendations:
  `,
});

const generateFortuneFlow = ai.defineFlow(
  {
    name: 'generateFortuneFlow',
    inputSchema: GenerateFortuneInputSchema,
    outputSchema: GenerateFortuneOutputSchema,
  },
  async input => {
    const {output} = await fortunePrompt(input);
    return output!;
  }
);
