import { useState } from "react";
import Game from "./Game/Game";
import EndLevel from "./EndLevel/EndLevel";
import beans from "@assets/img/beans.png";
import styles from "./GamePage.module.css";

import level1 from "./Levels/level1";
import level2 from "./Levels/level2";
import level3 from "./Levels/level3";
import level4 from "./Levels/level4";

const allData = [
	{ data: level1.data, initialLabels: level1.initialLabels },
	{ data: level2.data, initialLabels: level2.initialLabels },
	{ data: level3.data, initialLabels: level3.initialLabels },
	{ data: level4.data, initialLabels: level4.initialLabels },
];

const GamePage = () => {
	const [win, setWin] = useState<boolean>(false);
	const [currentStage, setCurrentStage] = useState<number>(1);

	return (
		<section className={styles.gamePage}>
			{!win && currentStage <= 4 ? (
				<Game currentData={allData[currentStage - 1]} setWin={setWin} />
			) : (
				<EndLevel stage={currentStage} setStage={setCurrentStage} setWin={setWin} />
			)}
			<img src={beans} alt="beans" className={styles.firstBeans} />
			<img src={beans} alt="beans" className={styles.secondBeans} />
		</section>
	);
};

export default GamePage;
