import { Routes, Route } from "react-router-dom";
import Home from "@components/pages/Home/Home";
import GamePage from "@components/pages/GamePage/GamePage";
import Main from "@components/Main/Main";

const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<Main />}>
				<Route index element={<Home />} />
				<Route path="/game" element={<GamePage />} />
			</Route>
		</Routes>
	);
};

export default AppRoutes;
