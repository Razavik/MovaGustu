import { Outlet } from "react-router-dom";
import Header from "@components/Header/Header";
import {useState} from "react";

const Main = () => {
	const [isGame, setIsGame] = useState(false);
	return (
		<>
			<Header setIsGame={setIsGame} />
			<main>
				<Outlet context={{
					isGame: isGame,
					setIsGame: setIsGame,
				}} />
			</main>
		</>
	);
};

export default Main;
