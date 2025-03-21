import { Routes, Route } from "react-router-dom";
import Main from "@components/Main/Main";
import MainPage from "@components/pages/MainPage/MainPage.tsx";

const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/coffee-quiz" element={<Main />}>
				<Route index element={<MainPage />} />
			</Route>
		</Routes>
	);
};

export default AppRoutes;
