import "./App.css";
import {BrowserRouter as Router} from "react-router-dom";
import AppRoutes from "./routes.tsx";
import {useGetContent} from "./hooks/useGetContent.ts";

function App() {
    const {
        isLoading: loadContent
    } = useGetContent()

    return (
        <>
            {
                !loadContent
                &&
                <div id={"root"}>
                    <Router>
                        <AppRoutes/>
                    </Router>
                </div>
            }
        </>
    );
}

export default App;
