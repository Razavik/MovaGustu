import "./App.css";
import AppRoutes from "./routes";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
	return (
		<div id={"root"}>
			<Router>
				<AppRoutes />
			</Router>
		</div>
	);
}

export default App;
