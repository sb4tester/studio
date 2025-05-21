'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2, Copy } from 'lucide-react';
import type { GenerateFortuneOutput } from '@/ai/flows/generate-fortune';

interface ShareButtonProps {
  fortuneData: GenerateFortuneOutput | null;
}

export function ShareButton({ fortuneData }: ShareButtonProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    if (!fortuneData) return;

    const textToShare = `คำทำนายจากแอปเขย่าเซียมซี:\n\nคำทำนาย: ${fortuneData.fortune}\n\nคำอธิบาย: ${fortuneData.interpretation}\n\nคำแนะนำ: ${fortuneData.recommendations}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'คำทำนายของฉันจากแอปเขย่าเซียมซี',
          text: textToShare,
        });
        toast({
          title: "แชร์คำทำนายแล้ว!",
          description: "ภูมิปัญญาของคุณถูกส่งต่อไปแล้ว",
        });
      } else {
        await navigator.clipboard.writeText(textToShare);
        toast({
          title: "คัดลอกคำทำนายแล้ว!",
          description: "คัดลอกคำทำนายของคุณไปยังคลิปบอร์ดแล้ว แบ่งปันอย่างชาญฉลาด!",
          action: <Copy className="w-5 h-5 text-primary" />,
        });
      }
    } catch (error) {
      console.error('Failed to share/copy:', error);
      try {
        await navigator.clipboard.writeText(textToShare);
        toast({
          title: "คัดลอกคำทำนายแล้ว!",
          description: "การแชร์ล้มเหลว แต่คัดลอกคำทำนายของคุณไปยังคลิปบอร์ดแล้ว",
          action: <Copy className="w-5 h-5 text-primary" />,
        });
      } catch (copyError) {
        console.error('Failed to copy to clipboard:', copyError);
        toast({
          title: "การแชร์ล้มเหลว",
          description: "ไม่สามารถแชร์หรือคัดลอกคำทำนายได้ โปรดลองอีกครั้ง",
          variant: "destructive",
        });
      }
    }
  };

  if (!fortuneData) return null;

  return (
    <Button onClick={handleShare} variant="outline" className="mt-6 border-accent text-accent hover:bg-accent/10 hover:text-accent shadow-md transform hover:scale-105 transition-transform duration-300 ease-out">
      <Share2 className="w-5 h-5 mr-2" />
      แบ่งปันคำทำนายของคุณ
    </Button>
  );
}
