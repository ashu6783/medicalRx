"use client"

import { useUser } from "@clerk/nextjs"

export const WelcomeMsg = () => {
    const { user, isLoaded } = useUser();
    return (
        <div className="space-y-2 mb-4">
            <h2 className="text-2xl lg:text-4xl text-white font-medium">
                Welcome Back {isLoaded && user && user.firstName ? user.firstName : ""}👋!
            </h2>
            <p className="text-sm lg:text-base text-[#9cf156]">
                Empowering healthcare with AI—analyze drugs, detect side effects, and enhance medical research effortlessly! ⚕️🔍
            </p>
        </div>
    )
}