import AnimatedBackground from "@/components/AnimatedBackground";
import { Header } from "@/components/header";

type Props = {
    children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
    return (
        <div className="flex flex-col min-h-screen relative">

            {/* Header with highest z-index */}
            <div className="relative z-50 w-full">
                <Header />
            </div>

            {/* Main content area */}
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;