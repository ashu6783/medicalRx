import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"



type Props = {
    href: string;
    label: React.ReactNode;
    isActive?: boolean;
}

export const NavButton = ({
    href,
    label, // Uncommented this line
    isActive,
}: Props) => {
    return (
        <Button
            asChild
            size="sm"
            variant='outline'
            className={cn(
                "w-full lg:w-auto justify-between font-base font-semibold hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition",
                isActive ? "bg-white/20 text-white" : "bg-transparent",
            )}
        >
            <Link href={href}>
                {label}
            </Link>
        </Button>
    )
}