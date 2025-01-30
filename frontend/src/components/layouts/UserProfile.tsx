
import {
    SidebarMenu,
    SidebarMenuItem,
} from "../ui/sidebar.tsx"

export function UserProfile({email, role} : {email: string | null, role:string | null}) {
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