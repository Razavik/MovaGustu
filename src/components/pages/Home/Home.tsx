import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import firstBlock from "@assets/img/first-block-img.png";
import beans from "@assets/img/beans.png";

const Home = () => {
	const navigate = useNavigate();
	return (
		<div className={styles.homeContainer}>
			<h1 className={styles.title}>Выбiрай ЦІКАВУЮ вясну!</h1>
			<img src={firstBlock} alt="img" className={styles.firstBlock} />
			<div className={styles.textContainer}>
				<h2 className={styles.subTitle}>Дакажы, што ты сапраўдны знаток кавы!</h2>
				<p className={styles.text}>
					Правер свае веды пра каву! Выканай <b>4 заданні</b> і атрымай <b>бонусы</b> на
					кожным этапе!
				</p>
				<button
					onClick={() => {
						navigate("/game");
					}}
					className={styles.button}
				>
					<svg
						width="222"
						height="65"
						viewBox="0 0 222 65"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.2))",
							pointerEvents: "none",
						}}
					>
						<path
							d="M0 13.1872V53.0667L11.7218 64.8245H209.554L221.276 53.0667V13.1872L208.129 0H13.1469L0 13.1872Z"
							fill="white"
						/>
					</svg>
					<span>Гуляць</span>
				</button>
			</div>
			<p className={styles.odo}>
				ОДО "Астотрейдинг". УНП 690362737
				<br />
				223053, Минский район, д. Боровая, д. 7, админ. помещения, кабинет 24
			</p>
			<img className={styles.firstBeans} src={beans} alt="beans" />
			<img className={styles.secondBeans} src={beans} alt="beans" />
			<img className={styles.thirdBeans} src={beans} alt="beans" />
		</div>
	);
};

export default Home;
