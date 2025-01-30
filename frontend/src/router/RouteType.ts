import { PathNames } from './PathNames.ts'

import Home from "../pages/Home.tsx"
import CreateUser from "../pages/CreateUser.tsx"
import Books from "../pages/Books.tsx";
import ActiveRents from "../pages/ActiveRents.tsx";
import Users from "../pages/Users.tsx";
import FutureRents from "@/pages/FutureRents.tsx";
import ArchivalRents from "@/pages/ArchivalRents.tsx";
import {Login} from "@/pages/Login.tsx";
import {Register} from "@/pages/Register.tsx";

/** Definiuje pseudo-mapy - tablice par ścieżka (kontekst URL) - komponent
 * Takie mapy są wykorzystywane przez mechanizm rutera, aby zdefiniować nawigację między widokami
 * @see PathNames
 */
export type RouteType = {
    Component: () => React.ReactElement,
    path: string
}


export const anonymousRoutes: RouteType[] = [
    {
        path: PathNames.default.home,
        Component: Home,
    },
    {
        path: PathNames.anonymous.login,
        Component: Login,
    },
    {
        path: PathNames.anonymous.register,
        Component: Register,
    }

]

export const adminRoutes: RouteType[] = [
    {
        path: PathNames.admin.createUser,
        Component: CreateUser
    },
    {
        path: PathNames.admin.users,
        Component: Users
    },
]

export const readerAndLibrarian: RouteType[] = [
    {
        path: PathNames.readerAndLibrarian.books,
        Component: Books
    },
]

export const readerRoutes: RouteType[] = [

    {
        path: PathNames.reader.futureRents,
        Component: FutureRents
    },
    {
        path: PathNames.reader.activeRents,
        Component: ActiveRents
    },
    {
        path: PathNames.reader.archivalRents,
        Component: ArchivalRents
    }

]