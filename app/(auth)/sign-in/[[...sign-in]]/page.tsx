'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { SignIn, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export default function Page() {
  const typedRef1 = useRef<HTMLSpanElement>(null);
  const typedRef2 = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typedRef1.current) {
      const typed1 = new Typed(typedRef1.current, {
        strings: [
          "It&apos;s time to care! ❤️",
          "MedicalRx⚕️ - by Ashu, for you!",
          "Just for showing my skills!",
          "With AI,a small help!",
          "Stay healthy, stay happy!",
          "Let&apos;s make healthcare simpler!"
        ],

        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        showCursor: false,
      });

      return () => typed1.destroy();
    }
  }, []);

  useEffect(() => {
    if (typedRef2.current) {
      const typed2 = new Typed(typedRef2.current, {
        strings: [
          "It&apos;s time to care! ❤️",
          "MedicalRx⚕️ - by Ashu, for you!",
          "Just for showing my skills!",
          "With AI,a small help!",
          "Stay healthy, stay happy!",
          "Let&apos;s make healthcare simpler!"
        ],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        cursorChar: '..',
      });

      return () => typed2.destroy();
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Three.js Background */}
      <AnimatedBackground />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Login Section */}
        <div className="flex flex-col items-center justify-center px-4 py-10">
          <div className="text-center space-y-2">
            <h1 className="font-bold text-3xl text-white">Hola Mate!!</h1>
            {/* Typed.js for MedicalRx below Hola Mate */}
            <span ref={typedRef1} className="font-bold lg:hidden text-xl text-[#97fdf5]" />
            <p className="text-base pt-1 text-gray-100">
              Log in or create an account to get back to your{' '}
              <span ref={typedRef2} className="font-bold text-[#97fdf5]" /> dashboard.
            </p>
          </div>
          <div className="flex items-center justify-center mt-8">
            <ClerkLoaded>
              <SignIn path="/sign-in" />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="animate-spin text-muted-foreground" />
            </ClerkLoading>
          </div>
        </div>

        {/* Branding Section */}
        <div className="hidden lg:flex flex-col space-y-2 items-center justify-center">
          <Image src="/logo.svg" height={100} width={100} alt="logo" className='pt-1' />
          {/* Fixed height wrapper to prevent layout shift */}
          <div className="h-7 flex items-center">
            <span ref={typedRef2} className="font-bold text-2xl text-white" />
          </div>
          <span className="font-semibold text-xl text-[#67e8f9]">
            AI-driven medical assistance & healthcare platform 💊
          </span>
          <span className="font-semibold text-sm text-gray-400">
            From Ashu, with ❤️—caring for your health, always.
          </span>
        </div>
      </div>
    </div>
  );
}
