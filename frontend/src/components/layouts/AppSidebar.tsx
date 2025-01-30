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
    HomeIcon, LockKeyholeIcon, LogInIcon,
    UserPlusIcon,
    UsersIcon
} from "lucide-react";
import {UserProfile} from "@/components/layouts/UserProfile.tsx";
import {SidebarItem} from "@/components/layouts/SidebarItem.ts";
import {useUserContext} from "@/context/useUserContext.tsx";
import {PathNames} from "@/router/PathNames.ts";


export function AppSidebar() {

    const {user} = useUserContext()

    let items: SidebarItem[] = []
    let rentItems: SidebarItem[] = []
    console.log("Role" + user.role)
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
                },
                {
                    title: "Change password",
                    url: PathNames.default.changePassword,
                    icon: LockKeyholeIcon,
                },

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
                },
                {
                    title: "Change password",
                    url: PathNames.default.changePassword,
                    icon: LockKeyholeIcon,
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
                },
                {
                    title: "Change password",
                    url: PathNames.default.changePassword,
                    icon: LockKeyholeIcon,
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
            {user.role!=null && (
                <SidebarFooter>
                    <UserProfile email={user.email} role={user.role} />
                </SidebarFooter>
            )}
        </Sidebar>
    )
}