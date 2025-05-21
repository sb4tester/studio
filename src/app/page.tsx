'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Sparkles, ListChecks } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-background text-foreground">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10 -z-10"></div>
      <Card className="w-full max-w-2xl shadow-2xl border-primary/50">
        <CardHeader className="text-center">
          <div className="inline-block p-4 mx-auto mb-4 rounded-full bg-primary/20 text-primary">
            <Landmark size={48} strokeWidth={1.5} />
          </div>
          <CardTitle className="text-5xl font-bold tracking-wider text-primary">Seer Shaker</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Unveil your destiny with the ancient art of Kao Chimsi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 space-y-4 text-center border rounded-lg bg-card border-primary/30">
            <ListChecks className="w-12 h-12 mx-auto mb-2 text-accent" />
            <h2 className="text-2xl font-semibold font-heading text-accent">How to Play</h2>
            <p className="text-muted-foreground">
              Follow these simple steps to receive your fortune:
            </p>
            <ol className="space-y-2 text-left list-decimal list-inside text-foreground">
              <li>Click the "Seek Your Fortune" button below.</li>
              <li>Focus your mind on a question or simply be open to guidance.</li>
              <li>Click "Shake the Seer Sticks" to generate your fortune.</li>
              <li>Reflect on the wisdom revealed.</li>
            </ol>
          </div>

          <div className="flex justify-center">
            <Link href="/shake" passHref>
              <Button size="lg" className="text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-300 ease-out">
                <Sparkles className="w-5 h-5 mr-2" />
                Seek Your Fortune
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
       <footer className="mt-12 text-sm text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Seer Shaker. All rights reserved.</p>
        <p>Fortune telling is for entertainment purposes only.</p>
      </footer>
    </main>
  );
}
