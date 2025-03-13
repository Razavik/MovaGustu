import styles from "./CoffeeCard.module.css";

interface CoffeeCardProps {
	image: string;
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
