import logo from "@assets/img/logo-2.png";
import logoShop from "@assets/img/logo-roast.png";
import styles from "./Header.module.css";
// import { useGetContent } from "../../hooks/useGetContent.ts";

const Header = ({ setIsGame }: any) => {
	// const { data: content } = useGetContent();

	return (
		<header className={styles.header}>
			<div className={`${styles.container} container`}>
				<div className={styles.left}>
					<button className={styles.button} onClick={() => setIsGame(false)}>
						<img src={logo} alt="logo" className={styles.logo} />
					</button>
					{/*<p dangerouslySetInnerHTML={{ __html: content?.headTitle ?? "" }}></p>*/}
				</div>
				<img src={logoShop} alt="logo-shop" className={styles.logoShop} />
			</div>
		</header>
	);
};

export default Header;
