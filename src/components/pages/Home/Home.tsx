import { Link } from "react-router-dom";

const Home = () => {
	return (
		<div className="home-container">
			<div className="start-button-container">
				<Link to="/game" className="start-button">
					Гуляць
				</Link>
			</div>
		</div>
	);
};

export default Home;
