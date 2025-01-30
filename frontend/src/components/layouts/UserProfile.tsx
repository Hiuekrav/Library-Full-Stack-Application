
import {
    SidebarMenu,
    SidebarMenuItem,
} from "../ui/sidebar.tsx"

export function UserProfile() {

    //todo get infomations from jwt in cookie
    const email: string ="Email";
    const role: string = "Role";
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-lg">Email: {email}</span>
                    <span className="truncate font-semibold text-sm">Role: {role}</span>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>

    )


}