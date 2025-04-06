"use client"
import { useState } from "react"
import { Menu, Stethoscope, FileText, MapPin, Phone, CalendarCheck } from "lucide-react"
import { useMedia } from "react-use"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { NavButton } from "./nav-button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"

const routes = [
    { href: '/diagnosis', label: "Diagnosis", icon: Stethoscope, color: "text-blue-400" },
    { href: '/prescription', label: "Prescription", icon: FileText, color: "text-green-400" },
    { href: '/navigation', label: "Navigation", icon: MapPin, color: "text-yellow-400" },
    { href: '/consultation', label: "Consultation", icon: Phone, color: "text-red-400" },
    { href: '/recovery', label: "Recovery", icon: CalendarCheck, color: "text-purple-400" },
]

export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const isMobile = useMedia("(max-width: 1024px)", false);

    const onClick = (href: string) => {
        router.push(href);
        setIsOpen(false);
    };

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger>
                    <Button
                        variant="outline"
                        size="lg"
                        className="font-normal bg-white/10 hover:bg-white/20 hover:text-white 
                        focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none
                        text-white focus:bg-white/30 transition border-none"
                    >
                        <Menu className="size-7" aria-label="Menu" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-2">
                    <nav className="flex flex-col gap-y-2 pt-6">
                        {routes.map(({ href, label, icon: Icon, color }) => (
                            <Button
                                key={href}
                                variant={href === pathname ? "secondary" : "ghost"}
                                onClick={() => onClick(href)}
                                className="w-full justify-start flex items-center gap-x-2"
                            >
                                <Icon className={`size-5 ${color}`} />
                                {label}
                            </Button>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
            {routes.map(({ href, label, icon: Icon, color }) => (
                <NavButton
                    key={href}
                    href={href}
                    label={
                        <span className="flex items-center gap-x-2">
                            <Icon className={`size-5 ${color}`} />
                            {label}
                        </span>
                    }
                    isActive={pathname === href}
                />
            ))}
        </nav>
    );
};
