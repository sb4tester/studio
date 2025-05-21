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

    const textToShare = `My Seer Shaker Fortune:\n\nFortune: ${fortuneData.fortune}\n\nInterpretation: ${fortuneData.interpretation}\n\nRecommendations: ${fortuneData.recommendations}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Seer Shaker Fortune',
          text: textToShare,
        });
        toast({
          title: "Fortune Shared!",
          description: "Your wisdom has been cast into the digital winds.",
        });
      } else {
        await navigator.clipboard.writeText(textToShare);
        toast({
          title: "Fortune Copied!",
          description: "Your fortune is copied to the clipboard. Share it wisely!",
          action: <Copy className="w-5 h-5 text-primary" />,
        });
      }
    } catch (error) {
      console.error('Failed to share/copy:', error);
      // Fallback to clipboard copy if navigator.share fails for reasons other than not existing
      try {
        await navigator.clipboard.writeText(textToShare);
        toast({
          title: "Fortune Copied!",
          description: "Sharing failed, but your fortune is copied to the clipboard.",
          action: <Copy className="w-5 h-5 text-primary" />,
        });
      } catch (copyError) {
        console.error('Failed to copy to clipboard:', copyError);
        toast({
          title: "Sharing Failed",
          description: "Could not share or copy the fortune. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (!fortuneData) return null;

  return (
    <Button onClick={handleShare} variant="outline" className="mt-6 border-accent text-accent hover:bg-accent/10 hover:text-accent shadow-md transform hover:scale-105 transition-transform duration-300 ease-out">
      <Share2 className="w-5 h-5 mr-2" />
      Share Your Fortune
    </Button>
  );
}
