import {useState} from "react";
import GamePage from "@components/pages/GamePage/GamePage.tsx";
import Home from "@components/pages/Home/Home.tsx";

export default function MainPage() {
    const [isGame, setIsGame] = useState(false);

    return (
        <>
            {
                isGame ? <GamePage /> : <Home setIsGame={setIsGame} />
            }
        </>
    )
}