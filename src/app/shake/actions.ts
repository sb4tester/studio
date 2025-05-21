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
    // Provide a more user-friendly error message if possible
    if (error instanceof Error && error.message.includes('deadline')) {
      throw new Error("The seer is contemplating deeply... please try again in a moment.");
    }
    throw new Error("Failed to generate fortune. The spirits are unclear at this time.");
  }
}
