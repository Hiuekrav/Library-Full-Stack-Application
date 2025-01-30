
/** Definiuje kolekcję ścieżek (kontekstów URL), które mogą prowadzić do widoków aplikacji
 */
export const PathNames = {
    anonymous: {
        login: '/login',
        register: '/register'
    },
    reader: {
        futureRents: '/rents/future',
        activeRents: '/rents/active',
        archivalRents: '/rents/archival',
    },
    readerAndLibrarian: {
        books: '/books',
    },
    admin: {
        createUser: '/create-user',
        users: '/users',
    },

    default: {
        home: '/',
        changePassword: '/change-password'
    }
}