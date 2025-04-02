import {
    UserButton, ClerkLoaded
    , ClerkLoading
} from "@clerk/nextjs"
import { HeaderLogo } from "./header-logo"
import { Navigation } from "./navigation"
import { Loader2 } from "lucide-react"
// import { WelcomeMsg } from "./welocme-msg"

export const Header = () => {
    return (
        <header className="bg-gradient-to-r from-[#12122b] to-[#0e0e1d] px-4 py-8 lg:px-14 pb-1 text-white">
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mb-8">
                    <div className="flex items-center lg:gap-x-16">
                        <HeaderLogo />
                        <Navigation />
                    </div>
                    <ClerkLoaded>
                        <UserButton afterSwitchSessionUrl="/" />
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="size-8 animate-spin tex-slate-400" />
                    </ClerkLoading>
                </div>
                {/* <WelcomeMsg /> */}
            </div>
        </header>
    )
}