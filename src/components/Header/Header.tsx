import logo from "@assets/img/logos/logo.png";
import logoShop from "@assets/img/logos/logo-shop.png";
import styles from "./Header.module.css";
import { useGetContent } from "../../hooks/useGetContent.ts";

const Header = () => {
	const { data: content } = useGetContent();

	return (
		<header className={styles.header}>
			<div className="container">
				<div className={styles.left}>
					<a href="https://azs.a-100.by">
						<img src={logo} alt="logo" className={styles.logo} />
					</a>
					<p dangerouslySetInnerHTML={{ __html: content?.headTitle ?? "" }}></p>
				</div>
				<img src={logoShop} alt="logo-shop" className={styles.logoShop} />
			</div>
		</header>
	);
};

export default Header;
