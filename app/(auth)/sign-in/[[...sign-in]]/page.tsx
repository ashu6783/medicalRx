'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { SignIn, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function Page() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Three.js Background */}
      <AnimatedBackground />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Login Section */}
        <div className="flex flex-col items-center justify-center px-4 py-10">
          <div className="text-center space-y-4">
            <h1 className="font-bold text-3xl text-white">Hola Mate!!</h1>
            <p className="text-base text-gray-100">
              Log in or create an account to get back to your{' '}
              <span className="font-bold text-[#97fdf5]">MedicalRx</span> dashboard.
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
          <Image src="/logo.svg" height={100} width={100} alt="logo" />
          <span className="font-bold text-2xl text-white">MedicalRx</span>
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
