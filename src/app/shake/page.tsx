'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FortuneDisplayCard } from '@/components/FortuneDisplayCard';
import { ShareButton } from '@/components/ShareButton';
import { getFortuneAction } from './actions';
import type { GenerateFortuneOutput } from '@/ai/flows/generate-fortune';
import { Loader2, AlertTriangle, Wand2, Dice5 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ShakePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fortuneData, setFortuneData] = useState<GenerateFortuneOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pastReadings, setPastReadings] = useState<string[]>([]);
  const [userQuery, setUserQuery] = useState<string>(''); // Optional: for user to input a specific question

  useEffect(() => {
    try {
      const storedReadings = localStorage.getItem('seerShakerPastReadings');
      if (storedReadings) {
        setPastReadings(JSON.parse(storedReadings));
      }
    } catch (e) {
      console.error("Failed to load past readings from localStorage", e);
      // Optionally clear corrupted data
      // localStorage.removeItem('seerShakerPastReadings');
    }
  }, []);

  const handleShake = async () => {
    setIsLoading(true);
    setError(null);
    setFortuneData(null);

    try {
      const result = await getFortuneAction({
        pastReadings,
        userQuery: userQuery || "Tell me my fortune for today.", // Default query
      });
      setFortuneData(result);

      const newFortuneText = `Fortune: ${result.fortune}\nInterpretation: ${result.interpretation}\nRecommendations: ${result.recommendations}`;
      const updatedReadings = [...pastReadings, newFortuneText].slice(-5); // Keep last 5 readings
      setPastReadings(updatedReadings);
      try {
        localStorage.setItem('seerShakerPastReadings', JSON.stringify(updatedReadings));
      } catch (e) {
        console.error("Failed to save past readings to localStorage", e);
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 pt-10 md:p-6 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="w-full max-w-2xl">
        {!fortuneData && !isLoading && (
          <Card className="mb-8 text-center shadow-xl border-primary/30">
            <CardHeader>
              <div className="inline-block p-4 mx-auto mb-4 rounded-full bg-primary/20 text-primary">
                <Wand2 size={40} strokeWidth={1.5} />
              </div>
              <CardTitle className="text-4xl font-heading text-primary">Consult the Oracle</CardTitle>
              <CardDescription className="text-md text-muted-foreground">
                Clear your mind, focus your intent, and when ready, shake the seer sticks.
              </CardDescription>
            </CardHeader>
            <CardContent>
               {/* Optional: Input for user query 
              <div className="mb-6">
                <Label htmlFor="userQuery" className="text-sm font-medium text-muted-foreground">Optional: Ask a specific question</Label>
                <Input
                  id="userQuery"
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="e.g., What should I focus on this week?"
                  className="mt-1 bg-background/70 focus:ring-primary"
                />
              </div>
              */}
              <Button
                onClick={handleShake}
                disabled={isLoading}
                size="lg"
                className="w-full max-w-xs text-lg transition-all duration-300 ease-out shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground transform hover:scale-105 active:scale-95"
              >
                <Dice5 className="w-6 h-6 mr-3 animate-spin-slow" />
                Shake the Seer Sticks
              </Button>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-10 text-center rounded-lg bg-card/80 shadow-lg h-60">
            <Loader2 className="w-16 h-16 mb-4 text-primary animate-spin" />
            <p className="text-xl font-semibold text-primary font-heading">Consulting the Spirits...</p>
            <p className="text-muted-foreground">Please wait while your fortune is being revealed.</p>
          </div>
        )}

        {error && !isLoading && (
          <Card className="p-6 text-center border-destructive bg-destructive/10 shadow-lg">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-destructive" />
            <CardTitle className="mb-2 text-2xl text-destructive font-heading">An Ominous Sign</CardTitle>
            <p className="mb-4 text-destructive-foreground">{error}</p>
            <Button onClick={handleShake} variant="destructive" className="text-destructive-foreground">
              Try Again
            </Button>
          </Card>
        )}

        {fortuneData && !isLoading && (
          <div className="flex flex-col items-center">
            <FortuneDisplayCard fortuneData={fortuneData} />
            <ShareButton fortuneData={fortuneData} />
             <Button onClick={() => { setFortuneData(null); setError(null); }} variant="outline" className="mt-4 text-primary border-primary hover:bg-primary/10">
              Seek Another Fortune
            </Button>
          </div>
        )}
      </div>
       <footer className="py-8 mt-auto text-sm text-center text-muted-foreground">
        <Link href="/" className="hover:text-primary">Back to Instructions</Link>
      </footer>
      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
