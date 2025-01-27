import {
    BookDown, BookHeart,
    BookIcon,
    BookMarked,
    BookOpenIcon,
    ChevronDown,
    HomeIcon,
    UserPlusIcon,
    UsersIcon
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem,
} from "../ui/sidebar.tsx"
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: HomeIcon,
    },
    {
        title: "Register",
        url: "/register",
        icon: UserPlusIcon,
    },
    {
        title: "Users",
        url: "/users",
        icon: UsersIcon,
    },
    {
        title: "Books",
        url: "/books",
        icon: BookIcon,
    }
]

const rentItems = [
    {
        title: "Future",
        url: "/rents/future",
        icon: BookMarked,
    },
    {
        title: "Active",
        url: "/rents/active",
        icon: BookHeart,
    },
    {
        title: "Archival",
        url: "/rents/archival",
        icon: BookDown,
    }
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Library</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url} className="text-decoration-none text-light">
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem>
                            <Collapsible defaultOpen className="group/collapsible">
                                    <SidebarMenuButton asChild>
                                        <CollapsibleTrigger>
                                            <BookOpenIcon className="mr-2" />
                                            Rents
                                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </CollapsibleTrigger>
                                    </SidebarMenuButton>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {rentItems.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuButton asChild>
                                                        <a href={item.url} className="text-decoration-none text-light">
                                                            <item.icon />
                                                            <span>{item.title}</span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                            </Collapsible>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
