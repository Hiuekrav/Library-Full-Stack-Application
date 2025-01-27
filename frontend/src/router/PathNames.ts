/** Definiuje kolekcję ścieżek (kontekstów URL), które mogą prowadzić do widoków aplikacji
 */
export const PathNames = {
    anonymous: {
    },
    user: {
        register: '/register',
        users: '/users',
        books: '/books',
        futureRents: '/rents/future',
        activeRents: '/rents/active',
        archivalRents: '/rents/archival',
    },
    admin: {
    },

    default: {
        home: '/',
    }
}