import { FC, ReactNode } from "react";
import styles from "./endLevel.module.css";
import logo from "@assets/img/logos/logo-promo.png";
import logoShop from "@assets/img/logos/logo-shop-promo.png";
import code from "@assets/img/code.png";
import prog from "@assets/img/program.png";

interface EndLevelProps {
	stage: number;
	setStage: (value: number) => void;
	setWin: (value: boolean) => void;
}

const EndLevel: FC<EndLevelProps> = ({ stage, setStage, setWin }) => {
	const handleNextLevel = () => {
		if (stage < 4) {
			setStage(stage + 1);
			setWin(false);
		}
	};

	const winText: ReactNode[] = [
		<h2>
			Віншуем! <br />
			<br /> Вы паспяхова справіліся з <b>{stage}-м заданнем</b> і можаце атрымаць бонус. Але
			вы можаце выканаць <b>яшчэ адно заданне</b> і павялічыць бонус!
		</h2>,
		<h2>
			Віншуем! <br />
			<br /> Вы паспяхова справіліся з <b>{stage}-м заданнем</b> і можаце атрымаць бонус. Але
			вы можаце выканаць <b>яшчэ адно заданне</b> і павялічыць бонус!
		</h2>,
		<h2>
			Віншуем! <br />
			Вы паспяхова справіліся з <b>{stage}-м заданнем</b> і можаце атрымаць бонус. Але вы
			можаце выканаць <b>яшчэ адно заданне</b> і стаць <b>сапраўдным знатаком кавы</b>!
		</h2>,
		<h2>
			Віншуем! <br />
			<br /> Вы паспяхова справіліся з {stage}-м заданнем і даказалі, што{" "}
			<b>Вы сапраўдны знаток кавы</b>!
		</h2>,
	];

	const promos = ["STRONG5", "DARK8", "BLEND10", "ROAST12"];

	const percent = [5, 8, 10, 12];

	return (
		<div className={styles.endLevel}>
			{winText[stage]}
			<div className={styles.promos}>
				<div className={`${styles.promoCardCoffee} ${styles.promoCard}`}>
					<div className={styles.subTitle}>
						<h3>
							Прамакод
							<br />
							зніжка {stage * 10}% на каву
						</h3>
						<div className={styles.divider}></div>
						<img src={logo} alt="logo-promo" />
					</div>
					<p className={styles.promo}>DHNJNI467</p>
					<img src={code} alt="code" />
					<div className={styles.info}>
						<p>
							Прамакод дзейнічае 3 (тры) дні з моманту атрымання і{" "}
							<b>
								толькі разам з бірулькай “Дзякуй”.
								<br />
								Пры адсутнасці бірулькі “Дзякуй”, яе можна набыть у аператара АЗС
								“А-100” ці
								<br />
								выпусціць у мабільным дадатку “Дзякуй”.
								<br />
							</b>
							Прамакод выкарыстоўваецца адзін раз i прад’яўляецца да моманты аплаты на
							касе.
						</p>
						<div className={styles.dividerInfo}></div>
						<img src={prog} alt="program" />
					</div>
				</div>
				<div className={`${styles.promoCardShop} ${styles.promoCard}`}>
					<div className={styles.subTitle}>
						<h3 className={styles.promoShopTitle}>
							Прамакод
							<br />
							зніжка {percent[stage - 1]}% на краму
						</h3>
						<div className={styles.divider}></div>
						<img src={logoShop} alt="logo-promo" />
					</div>
					<p className={styles.promo}>{promos[stage - 1]}</p>
					<p className={styles.infoShop}>
						Прамакод дзейнічае па 31.05.2025 з моманту атрымання на{" "}
						<b>куплю гарбаты і кавы ў інтэрнэт-краме Roast.by.</b>
						<br />
						Прамакод не сумуецца з іншымі зніжкамі.
						<br />
						Пры афармленні заказу ўвядзіце прамакод у поле "Прамакод".
					</p>
				</div>
			</div>
			<button className={styles.nextLevel} onClick={handleNextLevel}>
				<svg
					width="660"
					height="80"
					viewBox="0 0 660 80"
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
						d="M0 16.2744V65.4896L14.466 80H644.611L659.077 65.4897V16.2743L642.852 0H16.2245L0 16.2744Z"
						fill="white"
					/>
				</svg>
				<span>{stage < 4 ? "Хачу павялічыць бонус" : "Падзяліцца з сябрам"}</span>
			</button>
		</div>
	);
};

export default EndLevel;
