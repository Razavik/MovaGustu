import styles from "./CoffeeCard.module.css";

interface CoffeeCardProps {
	image: string;
	label?: string; // Опциональная метка для отображения над карточкой
}

const CoffeeCard = ({ image }: CoffeeCardProps) => {
	return (
		<div className={styles.coffeeCardContainer}>
			<div className={styles.coffeeCard}>
				<img src={image} alt="Кофе" className={styles.coffeeImage} />
			</div>
		</div>
	);
};

export default CoffeeCard;
