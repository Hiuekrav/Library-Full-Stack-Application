
import {
    SidebarMenu, SidebarMenuButton,
    SidebarMenuItem,
} from "../ui/sidebar.tsx"
import {useUserContext} from "@/context/useUserContext.tsx";

import {
    BookDown,
    BookHeart,
    BookIcon,
    BookMarked,
    BookOpenIcon,
    ChevronDown,
    HomeIcon, LogInIcon, LogOutIcon,
} from "lucide-react";

export function UserProfile({email, role} : {email: string | null, role:string | null}) {

    const {logOut} = useUserContext()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={logOut}>
                    <a href={''} className="text-decoration-none text-light">
                    <LogOutIcon/>
                    <span>Log out</span>
                    </a>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-lg">Email: {email}</span>
                    <span className="truncate font-semibold text-sm">Role: {role}</span>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>

    )


}