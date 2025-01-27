
import {BrowserRouter as Router} from "react-router-dom";
import {RoutesComponent} from "./router/RoutesComponent.tsx";



function App() {

    return (
        <>
            <Router>
                <RoutesComponent />
            </Router>
        </>
    )
}

export default App;