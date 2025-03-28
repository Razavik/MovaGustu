import GamePage from "@components/pages/GamePage/GamePage.tsx";
import Home from "@components/pages/Home/Home.tsx";
import {useOutletContext} from "react-router-dom";

export default function MainPage() {
    const {isGame, setIsGame} = useOutletContext<any>();


    return (
        <>
            {
                isGame ? <GamePage /> : <Home setIsGame={setIsGame} />
            }
        </>
    )
}