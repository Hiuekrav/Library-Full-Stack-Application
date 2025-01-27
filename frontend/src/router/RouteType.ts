import { PathNames } from './PathNames.ts'

import Home from "../pages/Home.tsx"
import Register from "../pages/Register.tsx"
import Books from "../pages/Books.tsx";
import ActiveRents from "../pages/ActiveRents.tsx";
import Users from "../pages/Users.tsx";
import FutureRents from "@/pages/FutureRents.tsx";
import ArchivalRents from "@/pages/ArchivalRents.tsx";

/** Definiuje pseudo-mapy - tablice par ścieżka (kontekst URL) - komponent
 * Takie mapy są wykorzystywane przez mechanizm rutera, aby zdefiniować nawigację między widokami
 * @see PathNames
 */
export type RouteType = {
    Component: () => React.ReactElement,
    path: string
}

export const defaultRoutes: RouteType[] = [
    {
        path: PathNames.default.home,
        Component: Home,
    }

]

export const adminRoutes: RouteType[] = [
]

export const userRoutes: RouteType[] = [
    {
        path: PathNames.user.register,
        Component: Register
    },
    {
        path: PathNames.user.users,
        Component: Users
    },
    {
        path: PathNames.user.books,
        Component: Books
    },
    {
        path: PathNames.user.futureRents,
        Component: FutureRents
    },
    {
        path: PathNames.user.activeRents,
        Component: ActiveRents
    },
    {
        path: PathNames.user.archivalRents,
        Component: ArchivalRents
    }

]

export const anonymousRoutes: RouteType[] = [
]