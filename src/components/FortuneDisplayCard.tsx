import type { GenerateFortuneOutput } from '@/ai/flows/generate-fortune';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollText, Lightbulb, Compass } from 'lucide-react';

interface FortuneDisplayCardProps {
  fortuneData: GenerateFortuneOutput;
}

export function FortuneDisplayCard({ fortuneData }: FortuneDisplayCardProps) {
  return (
    <Card className="w-full max-w-2xl shadow-xl border-primary/40 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-center mb-3">
           <ScrollText className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="text-3xl text-center font-heading text-primary">Your Fortune Revealed</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          The seer sticks have spoken. Ponder this wisdom.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 space-y-2 border rounded-lg border-primary/20 bg-background/50">
          <div className="flex items-center gap-2 text-accent">
            <Lightbulb className="w-6 h-6 " />
            <h3 className="text-xl font-semibold font-heading">Fortune</h3>
          </div>
          <p className="pl-1 text-lg leading-relaxed text-foreground">{fortuneData.fortune}</p>
        </div>
        
        <Separator className="my-4 bg-primary/30" />

        <div className="p-4 space-y-2 border rounded-lg border-primary/20 bg-background/50">
          <div className="flex items-center gap-2 text-accent">
             <Compass className="w-6 h-6" />
            <h3 className="text-xl font-semibold font-heading">Interpretation</h3>
          </div>
          <p className="pl-1 leading-relaxed text-foreground">{fortuneData.interpretation}</p>
        </div>

        <Separator className="my-4 bg-primary/30" />
        
        <div className="p-4 space-y-2 border rounded-lg border-primary/20 bg-background/50">
           <div className="flex items-center gap-2 text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
            <h3 className="text-xl font-semibold font-heading">Recommendations</h3>
          </div>
          <ul className="pl-1 space-y-1 list-disc list-inside text-foreground">
            {fortuneData.recommendations.split('\n').map((rec, index) => rec.trim() && !rec.trim().startsWith('-') ? <li key={index}>{rec.trim()}</li> : rec.trim().startsWith('-') ? <li key={index}>{rec.trim().substring(1).trim()}</li> : null)}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
