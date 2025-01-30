
import {BrowserRouter as Router} from "react-router-dom";
import {RoutesComponent} from "./router/RoutesComponent.tsx";
import {UserProvider} from "@/context/UserContext.tsx";



function App() {

    return (
        <>
                <Router>
                    <UserProvider>
                        <RoutesComponent />
                    </UserProvider>
                </Router>

        </>
    )
}

export default App;