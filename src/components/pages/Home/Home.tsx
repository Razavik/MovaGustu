import styles from "./Home.module.css";
import firstBlock from "@assets/img/first-block-img.png";
import beans from "@assets/img/beans.png";
import {Dispatch, SetStateAction} from "react";
import {useGetContent} from "../../../hooks/useGetContent.ts";

interface HomeProps {
	setIsGame: Dispatch<SetStateAction<boolean>>;
}

const Home = ({ setIsGame }: HomeProps) => {
	const {
		data: content
	} = useGetContent()

	return (
		<div className={styles.homeContainer}>
			<h1 dangerouslySetInnerHTML={{ __html: (content?.mainPage?.mainTitle ?? "") }} className={styles.title}></h1>
			<img src={firstBlock} alt="img" className={styles.firstBlock} />
			<div className={styles.textContainer}>
				<h2 dangerouslySetInnerHTML={{ __html: (content?.mainPage?.mainSubTitle ?? "") }} className={styles.subTitle}></h2>
				<p dangerouslySetInnerHTML={{ __html: (content?.mainPage?.mainSubSubTitle ?? "") }} className={styles.text}>
				</p>
				<button
					onClick={() => {
						setIsGame(true)
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
					<span>{ content?.mainPage?.mainButton ?? "" }</span>
				</button>
			</div>
			<p dangerouslySetInnerHTML={{ __html: (content?.mainPage?.mainFooter ?? "")  }} className={styles.odo}>
			</p>
			<img className={styles.firstBeans} src={beans} alt="beans" />
			<img className={styles.secondBeans} src={beans} alt="beans" />
			<img className={styles.thirdBeans} src={beans} alt="beans" />
		</div>
	);
};

export default Home;
