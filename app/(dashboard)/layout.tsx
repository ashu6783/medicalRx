import { Header } from "@/components/header";
// import Overview from "./overview/page";
type Props = {
    children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
    return (
        <>
            <Header />
            <main className="">
                {/* <Overview /> */}
                {children}
            </main>
        </>
    );
};

export default DashboardLayout;
