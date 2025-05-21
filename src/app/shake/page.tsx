'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FortuneDisplayCard } from '@/components/FortuneDisplayCard';
import { ShareButton } from '@/components/ShareButton';
import { getFortuneAction } from './actions';
import type { GenerateFortuneOutput } from '@/ai/flows/generate-fortune';
import { Loader2, AlertTriangle, Wand2, Dice5 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile

const SHAKE_THRESHOLD = 25; // Adjust sensitivity: higher means less sensitive
const SHAKE_TIMEOUT_MS = 1000; // Cooldown period after a shake is detected

export default function ShakePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fortuneData, setFortuneData] = useState<GenerateFortuneOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pastReadings, setPastReadings] = useState<string[]>([]);
  const [userQuery, setUserQuery] = useState<string>('');
  const isMobile = useIsMobile();
  const [isDetectingShake, setIsDetectingShake] = useState(false); // To prevent multiple triggers from one shake

  useEffect(() => {
    try {
      const storedReadings = localStorage.getItem('seerShakerPastReadings');
      if (storedReadings) {
        setPastReadings(JSON.parse(storedReadings));
      }
    } catch (e) {
      console.error("Failed to load past readings from localStorage", e);
    }
  }, []);

  const handleShake = useCallback(async () => {
    if (isLoading) return; // Prevent multiple calls if already loading

    setIsLoading(true);
    setError(null);
    setFortuneData(null);

    try {
      const result = await getFortuneAction({
        pastReadings,
        userQuery: userQuery || "บอกโชคชะตาของฉันสำหรับวันนี้", 
      });
      setFortuneData(result);

      const newFortuneText = `คำทำนาย: ${result.fortune}\nคำอธิบาย: ${result.interpretation}\nคำแนะนำ: ${result.recommendations}`;
      const updatedReadings = [...pastReadings, newFortuneText].slice(-5); 
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
        setError("เกิดข้อผิดพลาดที่ไม่รู้จัก");
      }
    } finally {
      setIsLoading(false);
      setIsDetectingShake(false); // Reset shake detection flag
    }
  }, [isLoading, pastReadings, userQuery]); // Removed set-state functions from deps

  useEffect(() => {
    if (isMobile && !isLoading && !fortuneData && !error && !isDetectingShake) {
      let lastShakeTime = 0;
      let lastX: number | null = null;
      let lastY: number | null = null;
      let lastZ: number | null = null;
      let motionPermissionGranted = true; // Assume true, adjust if using explicit permission API

      const requestMotionPermission = async () => {
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
          try {
            const permissionState = await (DeviceMotionEvent as any).requestPermission();
            if (permissionState === 'granted') {
              motionPermissionGranted = true;
            } else {
              motionPermissionGranted = false;
              console.warn('Device motion permission not granted.');
            }
          } catch (permissionError) {
            console.error('Error requesting device motion permission:', permissionError);
            motionPermissionGranted = false;
          }
        }
      };
      
      // Immediately try to request permission on component mount for relevant devices
      // This is a basic attempt; a more robust solution might involve a UI button for permission.
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        requestMotionPermission();
      }


      const handleMotion = (event: DeviceMotionEvent) => {
        if (!motionPermissionGranted || isDetectingShake || isLoading) return;

        const currentTime = new Date().getTime();
        if ((currentTime - lastShakeTime) < SHAKE_TIMEOUT_MS) {
          return;
        }

        const acceleration = event.accelerationIncludingGravity;
        if (!acceleration || acceleration.x === null || acceleration.y === null || acceleration.z === null) return;

        const { x, y, z } = acceleration;

        if (lastX !== null && lastY !== null && lastZ !== null) {
          const deltaX = Math.abs(x - lastX);
          const deltaY = Math.abs(y - lastY);
          const deltaZ = Math.abs(z - lastZ);
          const totalAcceleration = deltaX + deltaY + deltaZ;
          
          if (totalAcceleration > SHAKE_THRESHOLD) {
            lastShakeTime = currentTime;
            setIsDetectingShake(true); // Set flag to prevent immediate re-trigger
            handleShake();
          }
        }
        lastX = x;
        lastY = y;
        lastZ = z;
      };

      window.addEventListener('devicemotion', handleMotion);
      return () => {
        window.removeEventListener('devicemotion', handleMotion);
      };
    }
  }, [isMobile, isLoading, fortuneData, error, handleShake, isDetectingShake]);


  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 pt-10 md:p-6 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="w-full max-w-2xl">
        {!fortuneData && !isLoading && (
          <Card className="mb-8 text-center shadow-xl border-primary/30">
            <CardHeader>
              <div className="inline-block p-4 mx-auto mb-4 rounded-full bg-primary/20 text-primary">
                <Wand2 size={40} strokeWidth={1.5} />
              </div>
              <CardTitle className="text-4xl font-heading text-primary">ปรึกษาเทพพยากรณ์</CardTitle>
              <CardDescription className="text-md text-muted-foreground">
                {isMobile 
                  ? "ทำจิตใจให้ว่าง ตั้งสมาธิให้แน่วแน่ เมื่อพร้อมแล้ว เขย่ามือถือของคุณ หรือกดปุ่ม!"
                  : "ทำจิตใจให้ว่าง ตั้งสมาธิให้แน่วแน่ เมื่อพร้อมแล้ว กดปุ่มเพื่อเขย่าติ้ว"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleShake}
                disabled={isLoading || isDetectingShake}
                size="lg"
                className="w-full max-w-xs text-lg transition-all duration-300 ease-out shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground transform hover:scale-105 active:scale-95"
              >
                <Dice5 className="w-6 h-6 mr-3 animate-spin-slow" />
                {isMobile ? "เริ่มเขย่า!" : "เขย่าติ้ว"}
              </Button>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-10 text-center rounded-lg bg-card/80 shadow-lg h-60">
            <Loader2 className="w-16 h-16 mb-4 text-primary animate-spin" />
            <p className="text-xl font-semibold text-primary font-heading">กำลังปรึกษาเทพพยากรณ์...</p>
            <p className="text-muted-foreground">โปรดรอสักครู่ ขณะที่คำทำนายของคุณกำลังจะปรากฏ</p>
          </div>
        )}

        {error && !isLoading && (
          <Card className="p-6 text-center border-destructive bg-destructive/10 shadow-lg">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-destructive" />
            <CardTitle className="mb-2 text-2xl text-destructive font-heading">ลางร้าย</CardTitle>
            <p className="mb-4 text-destructive-foreground">{error}</p>
            <Button onClick={handleShake} variant="destructive" className="text-destructive-foreground"  disabled={isDetectingShake}>
              ลองอีกครั้ง
            </Button>
          </Card>
        )}

        {fortuneData && !isLoading && (
          <div className="flex flex-col items-center">
            <FortuneDisplayCard fortuneData={fortuneData} />
            <ShareButton fortuneData={fortuneData} />
             <Button onClick={() => { setFortuneData(null); setError(null); setIsDetectingShake(false); }} variant="outline" className="mt-4 text-primary border-primary hover:bg-primary/10">
              ขอคำทำนายอีกครั้ง
            </Button>
          </div>
        )}
      </div>
       <footer className="py-8 mt-auto text-sm text-center text-muted-foreground">
        <Link href="/" className="hover:text-primary">กลับไปหน้าแนะนำวิธีเล่น</Link>
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
