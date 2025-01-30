
import {SidebarProvider, SidebarTrigger} from "../ui/sidebar.tsx";
import {ErrorProvider} from "@/context/AlertContext.tsx";
import {AppSidebar} from "@/components/layouts/AppSidebar.tsx";


const getCookie = (name: string): string | undefined => {
    const cookies = document.cookie.split('; '); // Split cookies into individual key-value pairs
    for (const cookie of cookies) {
        const [key, value] = cookie.split('='); // Split each cookie into key and value
        if (key === name) {
            return decodeURIComponent(value); // Decode cookie value and return it
        }
    }
    return undefined; // Return undefined if cookie not found
};

interface LayoutProps {
    //sidebarComponent: React.ComponentType
    children: React.ReactNode
}

export function SidebarLayout({children }: LayoutProps) {
    const sidebarState = getCookie("sidebar:state");
    console.log(sidebarState);
    return (
        <>
            <SidebarProvider defaultOpen={sidebarState === "true"} >
                <AppSidebar />
                    <ErrorProvider>
                        <main style={{background: "#161819", width: "98vw" }}>
                            <SidebarTrigger className="text-white" />
                        <div className="text-white">
                                {children}
                        </div>
                        </main>
                    </ErrorProvider>
            </SidebarProvider>
        </>

    )
}