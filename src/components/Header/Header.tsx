import logo from "@assets/img/logo.png";
import logoShop from "@assets/img/logo-shop.png";
import styles from "./Header.module.css";

const Header = () => {
	return (
		<header className={styles.header}>
			<div className="container">
				<div className={styles.left}>
					<img src={logo} alt="logo" />
					<p>Вясна са смакам кавы!</p>
				</div>
				<img src={logoShop} alt="logo-shop" />
			</div>
		</header>
	);
};

export default Header;
