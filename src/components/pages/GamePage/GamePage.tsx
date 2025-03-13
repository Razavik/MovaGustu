import { useState } from "react";
import Game from "./Game/Game";
import EndLevel from "./EndLevel/EndLevel";

const GamePage = () => {
	const [win, setWin] = useState(false);

	return <>{!win ? <Game setWin={setWin} /> : <EndLevel />}</>;
};

export default GamePage;
