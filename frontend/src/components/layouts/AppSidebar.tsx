import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem
} from "@/components/ui/sidebar.tsx";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {
    BookDown,
    BookHeart,
    BookIcon,
    BookMarked,
    BookOpenIcon,
    ChevronDown,
    HomeIcon, LogInIcon,
    UserPlusIcon,
    UsersIcon
} from "lucide-react";
import {UserProfile} from "@/components/layouts/UserProfile.tsx";
import {SidebarItem} from "@/components/layouts/SidebarItem.ts";
import {useUserContext} from "@/context/useUserContext.tsx";


export function AppSidebar() {

    const {user} = useUserContext()

    let items: SidebarItem[] = []
    let rentItems: SidebarItem[] = []
    switch (user.role) {
        case "ADMIN": {
            items = [
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
                }
            ]
            break;
        }
        case "LIBRARIAN": {
            items = [
                {
                    title: "Home",
                    url: "/",
                    icon: HomeIcon,
                },
                {
                    title: "Books",
                    url: "/books",
                    icon: BookIcon,
                }
            ]
            break;
        }
        case "READER": {
            items = [
                {
                    title: "Home",
                    url: "/",
                    icon: HomeIcon,
                },
                {
                    title: "Books",
                    url: "/books",
                    icon: BookIcon,
                }
            ]
            rentItems = [
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
            break;
        }
        default: {
            items = [
                {
                    title: "Home",
                    url: "/",
                    icon: HomeIcon,
                },
                {
                    title: "Login",
                    url: "/login",
                    icon: LogInIcon,
                },
                {
                    title: "Register",
                    url: "/register",
                    icon: UserPlusIcon,
                },
            ]

        }
    }

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

                            {rentItems.length != 0 && (
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
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            {user.role!="ANONYMOUS" && (
                <SidebarFooter>
                    <UserProfile email={user.email} role={user.role} />
                </SidebarFooter>
            )}
        </Sidebar>
    )
}