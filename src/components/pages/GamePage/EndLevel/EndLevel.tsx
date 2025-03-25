import {FC, ReactNode, useState} from "react";
import styles from "./endLevel.module.css";
import logo from "@assets/img/logos/logo-promo.png";
import logoShop from "@assets/img/logos/logo-shop-promo.png";
import prog from "@assets/img/program.png";
import {useMutationState} from "@tanstack/react-query";
import {CuponsData} from "../../../../hooks/useGetCupons.ts";
import {useGetContent} from "../../../../hooks/useGetContent.ts";

interface EndLevelProps {
	stage: number;
	setStage: (value: number) => void;
	setWin: (value: boolean) => void;
}

const EndLevel: FC<EndLevelProps> = ({ stage, setStage, setWin }) => {
	const {
		data: content
	} = useGetContent()

	const [isCopy, setIsCopy] = useState(false)

	const state = useMutationState({ filters: { mutationKey: ["get-cupon"] } })
	const currentData = state?.[state.length - 1]?.data as {
		data: CuponsData | null
	}

	const handleNextLevel = () => {
		if (stage < 4) {
			setStage(stage + 1);
			setWin(false);
		}

		else {
			const currentUrl = window.location.href;

			navigator.clipboard.writeText(currentUrl)
				.then(() => {
					setIsCopy(true);
					setTimeout(() => setIsCopy(false), 2000);
				})
				.catch((err) => {
					console.error('Не удалось скопировать ссылку: ', err);
				});
		}
	};



	const winText: ReactNode[] = [
		<h2 dangerouslySetInnerHTML={{ __html: (content?.firstTask?.firstTaskResults?.firstTaskResultsTitle ?? "") }}>
		</h2>,
		<h2 dangerouslySetInnerHTML={{ __html: (content?.secondTask?.secondTaskResult?.secondTaskResultTitle ?? "") }}>
		</h2>,
		<h2 dangerouslySetInnerHTML={{ __html: (content?.thirdTask?.thirdTaskResult?.thirdTaskResultTitle ?? "") }}>
		</h2>,
		<h2 dangerouslySetInnerHTML={{ __html: (content?.fourthTask?.fourthTaskResult?.fourthTaskResultTitle ?? "") }}>
		</h2>,
	];

	console.log(stage, winText)

	const promosTextA100 = [
		(content?.firstTask?.firstTaskResults?.firstTaskResultsA100Title ?? ""),
		(content?.secondTask?.secondTaskResult?.secondTaskResultA100Title ?? ""),
		(content?.thirdTask?.thirdTaskResult?.thirdTaskResultA100Title ?? ""),
		(content?.fourthTask?.fourthTaskResult?.fourthTaskResultA100Title ?? "")
	]

	const footerTextA100 = [
		(content?.firstTask?.firstTaskResults?.firstTaskResultsA100Footer ?? ""),
		(content?.secondTask?.secondTaskResult?.secondTaskResultsA100Footer ?? ""),
		(content?.thirdTask?.thirdTaskResult?.thirdTaskResultsA100Footer ?? ""),
		(content?.fourthTask?.fourthTaskResult?.fourthTaskResultsA100Footer ?? "")
	]

	const promosTextRoast = [
		(content?.firstTask?.firstTaskResults?.firstTaskResultsRoastTitle ?? ""),
		(content?.secondTask?.secondTaskResult?.secondTaskResultsRoastTitle ?? ""),
		(content?.thirdTask?.thirdTaskResult?.thirdTaskResultsRoastTitle ?? ""),
		(content?.fourthTask?.fourthTaskResult?.fourthTaskResultsRoastTitle ?? "")
	]

	const footerTextRoast = [
		(content?.firstTask?.firstTaskResults?.firstTaskResultsRoastFooter ?? ""),
		(content?.secondTask?.secondTaskResult?.secondTaskResultsRoastFooter ?? ""),
		(content?.thirdTask?.thirdTaskResult?.thirdTaskResultsRoastFooter ?? ""),
		(content?.fourthTask?.fourthTaskResult?.fourthTaskResultsRoastFooter ?? "")
	]

	const buttons = [
		(content?.firstTask?.firstTaskResults?.firstTaskResultsBtn ?? ""),
		(content?.secondTask?.secondTaskResult?.secondTaskResultsBtn ?? ""),
		(content?.thirdTask?.thirdTaskResult?.thirdTaskResultsBtn ?? ""),
		(content?.fourthTask?.fourthTaskResult?.fourthTaskResultsBtn ?? "")
	]

	return (
		<div className={styles.endLevel}>
			{winText[stage - 1]}
			<div className={styles.promos}>
				<div className={`${styles.promoCardCoffee} ${styles.promoCard}`}>
					<div className={styles.subTitle}>
						<h3 dangerouslySetInnerHTML={{ __html: promosTextA100[stage - 1] ?? "" }}>
						</h3>
						<div className={styles.divider}></div>
						<img src={logo} alt="logo-promo" />
					</div>
					<p className={styles.promo}>{currentData?.data?.a100?.promocode ?? ""}</p>
					<img src={`${import.meta.env.VITE_STATIC_PATH}${currentData?.data?.a100?.barcode}`} alt="code" />
					<div className={styles.info}>
						<p dangerouslySetInnerHTML={{ __html: footerTextA100[stage - 1] ?? "" }}>
						</p>
						<div className={styles.dividerInfo}></div>
						<img src={prog} alt="program" />
					</div>
				</div>
				<div className={`${styles.promoCardShop} ${styles.promoCard}`}>
					<div className={styles.subTitle}>
						<h3 dangerouslySetInnerHTML={{ __html: promosTextRoast[stage - 1] ?? "" }} className={styles.promoShopTitle}>
						</h3>
						<div className={styles.divider}></div>
						<img src={logoShop} alt="logo-promo" />
					</div>
					<p className={styles.promo}>{currentData?.data?.roust?.promocode ?? ""}</p>
					<p dangerouslySetInnerHTML={{ __html: footerTextRoast[stage - 1] ?? "" }} className={styles.infoShop}>
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
				<span dangerouslySetInnerHTML={{ __html: isCopy ? "Cпасылка скапіявана!" : (buttons[stage - 1] ?? "") }}></span>
			</button>
		</div>
	);
};

export default EndLevel;
