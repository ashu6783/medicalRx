"use client"
import { useState } from "react"
import { Menu } from "lucide-react"
import { useMedia } from "react-use"
import { usePathname, useRouter } from "next/navigation" // Import to check active route
import { Button } from "./ui/button"
import { NavButton } from "./nav-button" // Import the NavButton component
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"

const routes = [
    // {
    //     href: '/overview',
    //     label: "Overview",
    // },
    {
        href: '/diagnosis',
        label: "Diagnosis🔍",
    },
    {
        href: '/prescription',
        label: "Prescription📝",
    },
    {
        href: '/navigation',
        label: "Navigation📍",
    },
    {
        href: '/consultation',
        label: "Consultation📞",
    },
    {
        href: '/recovery',
        label: "Recovery📆",
    },
]

export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname()
    const isMobile = useMedia("(max-width: 1024px)", false)
    const onClick = (href: string) => {
        router.push(href);
        setIsOpen(false);
    }
    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger>
                    <Button
                        variant="outline"
                        size="sm"
                        className="font-normal bg-white/10 hover:bgwhite/20 hover:text-white 
                    focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none
                     text-white focus:bg-white/30 transition border-none"
                    >
                        <Menu className="size-4" />
                    </Button>
                    <SheetContent side='left' className="px-2" >
                        <nav className="flex flex-col gap-y-2 pt-6">
                            {routes.map((route) => (
                                <Button
                                    key={route.href}
                                    variant={route.href === pathname ? "secondary" : "ghost"}
                                    onClick={() => onClick(route.href)}
                                    className="w-full justify-start"
                                >
                                    {route.label}
                                </Button>
                            ))}
                        </nav>

                    </SheetContent>

                </SheetTrigger>

            </Sheet>
        )
    }
    // Get current path to determine active route

    return (
        <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
            {routes.map((route) => (
                <NavButton
                    key={route.href}
                    href={route.href}
                    label={route.label}
                    isActive={pathname === route.href}
                />
            ))}
        </nav>
    )
}