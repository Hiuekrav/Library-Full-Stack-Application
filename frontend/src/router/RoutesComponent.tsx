import {Route, Routes} from 'react-router-dom'
import {adminRoutes, anonymousRoutes, defaultRoutes, readerAndLibrarian, readerRoutes} from './RouteType.ts'
import {SidebarLayout} from "../components/layouts/SidebarLayout.tsx";
import {PageNotFound} from "@/pages/PageNotFound.tsx";
import {RequireAuth} from "@/router/RequireAuth.tsx";

/** Komponent rutera definiuje możliwe ścieżki (konteksty URL), które prowadzą do określonych widoków (komponentów)
 * Używana jest do tego mapa łącząca ścieżkę z komponentem.
 * Tu użyta jest konstrukcja używająca wielu map, w zamyśle dzieli ona widoki ze względu na dostępność dla poszczególnych poziomów dostępu
 * Dla uproszczenia we wszystkich przypadkach jest używany ten sam szablon strony, ale można by stworzyć wiele szablonów i zmieniać wygląd aplikacji
 *
 * @see routes
 * @see SidebarLayout
 */
export const RoutesComponent = () => {


    return (
        <>
        <Routes>
            {anonymousRoutes.map(({path, Component}) => (
                <Route key={path} path={path} element={
                    <SidebarLayout>
                        <Component />
                    </SidebarLayout>
                }
                />
            ))}
            {defaultRoutes.map(({path, Component}) => (
                <Route key={path} path={path} element={
                    <RequireAuth allowedRoles={['READER', 'LIBRARIAN', 'ADMIN']}>
                        <SidebarLayout>
                            <Component />
                        </SidebarLayout>
                    </RequireAuth>
                }
                />
            ))}

            {readerRoutes.map(({path, Component}) => (
                <Route key={path} path={path} element={
                    <RequireAuth allowedRoles={['READER']}>
                        <SidebarLayout>
                            <Component />
                        </SidebarLayout>
                    </RequireAuth>
                }
                />
            ))}
            {readerAndLibrarian.map(({path, Component}) => (
                <Route key={path} path={path} element={
                    <RequireAuth allowedRoles={['READER', 'LIBRARIAN']}>
                        <SidebarLayout>
                            <Component />
                        </SidebarLayout>
                    </RequireAuth>
                }
                />
            ))}
            {adminRoutes.map(({path, Component}) => (
                <Route key={path} path={path} element={
                    <RequireAuth allowedRoles={['ADMIN']}>
                        <SidebarLayout>
                            <Component />
                        </SidebarLayout>
                    </RequireAuth>
                }
                />
            ))}
            <Route path="*" element={<SidebarLayout>
                <PageNotFound />
            </SidebarLayout>} />
        </Routes>
        </>
    )
}