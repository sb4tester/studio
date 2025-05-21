'use server';
import { generateFortune, type GenerateFortuneInput, type GenerateFortuneOutput } from '@/ai/flows/generate-fortune';

export async function getFortuneAction(input: GenerateFortuneInput): Promise<GenerateFortuneOutput> {
  try {
    // Add a small delay to simulate shaking and processing, enhancing user experience
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    const result = await generateFortune(input);
    return result;
  } catch (error) {
    console.error("Error generating fortune:", error);
    if (error instanceof Error && error.message.includes('deadline')) {
      throw new Error("เทพพยากรณ์กำลังครุ่นคิดอย่างหนัก... โปรดลองอีกครั้งในอีกสักครู่");
    }
    throw new Error("ไม่สามารถสร้างคำทำนายได้ เทพพยากรณ์ยังไม่ชัดเจนในขณะนี้");
  }
}
