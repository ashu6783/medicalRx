import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

type Props = {
    href: string;
    label: React.ReactNode;
    isActive?: boolean;
    icon?: React.ReactNode;
}

export const NavButton = ({
    href,
    label,
    isActive,
    icon, 
}: Props) => {
    return (
        <Button
            asChild
            size="sm"
            variant='outline'
            className={cn(
                "w-full lg:w-auto justify-between font-medium px-4 py-2 rounded-md hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition-all duration-200",
                isActive ? "bg-white/20 text-white shadow-sm" : "bg-transparent",
            )}
        >
            <Link href={href} className="flex items-center gap-2">
                {icon && <span className="flex-shrink-0">{icon}</span>}
                <span>{label}</span>
            </Link>
        </Button>
    )
}