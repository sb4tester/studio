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
  fortune: z.string().describe('คำทำนายที่สร้างขึ้นในรูปแบบกลอนภาษาไทย'),
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
  prompt: `ท่านคือโหรผู้ชาญฉลาด เชี่ยวชาญในการตีความโชคชะตาและให้คำแนะนำเฉพาะบุคคล
  โปรดดูผลคำทำนายที่ผ่านมาและบริบทปัจจุบันของผู้ใช้ เพื่อสร้างคำทำนายใหม่ ตีความหมาย
  และให้คำแนะนำที่ปรับให้เหมาะกับแต่ละบุคคล พิจารณาประวัติของผู้ใช้เพื่อนำเสนอข้อมูลเชิงลึกที่ไม่เหมือนใคร

  สำคัญมาก: สร้าง "fortune" (คำทำนาย) เป็นบทกลอนภาษาไทยที่ไพเราะและมีความหมาย

  ผลคำทำนายที่ผ่านมา:
  {{#if pastReadings}}
  {{#each pastReadings}}
  - {{{this}}}
  {{/each}}
  {{else}}
  ไม่มีผลคำทำนายที่ผ่านมา
  {{/if}}

  คำถามจากผู้ใช้: {{{userQuery}}}

  กรุณาสร้างผลลัพธ์ตามโครงสร้าง JSON ที่กำหนดใน output schema.
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
