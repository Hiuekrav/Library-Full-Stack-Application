/** Definiuje kolekcję ścieżek (kontekstów URL), które mogą prowadzić do widoków aplikacji
 */
export const PathNames = {
    anonymous: {
        login: '/login',
        register: '/register'
    },
    user: {
        books: '/books',
        futureRents: '/rents/future',
        activeRents: '/rents/active',
        archivalRents: '/rents/archival',
    },
    librarian: {
        books: '/books',
    },
    admin: {
        createUser: '/create-user',
        users: '/users',
    },

    default: {
        home: '/',
    }
}