// Импортируем изображения
import img1 from "@assets/img/level-2/картинка 1.png";
import img2 from "@assets/img/level-2/картинка 2.png";
import img3 from "@assets/img/level-2/картинка 3.png";
import img4 from "@assets/img/level-2/картинка 4.png";

import { Data, InitialLabels } from "@components/pages/GamePage/types/types";

const data: Data[] = [
    {
        id: "thin",
        type: "Тонкі",
        image: img2,
    },
    {
        id: "large",
        type: "Буйны",
        image: img4,
    },
    {
        id: "ultrathin",
        type: "Ультратонкі",
        image: img1,
    },
    {
        id: "normal",
        type: "Сярэдні",
        image: img3,
    },
];

const initialLabels: InitialLabels[] = [
    {
        id: `label-${data[0].id}`,
        type: data[0].type,
        targetId: data[0].id,
    },
    {
        id: `label-${data[1].id}`,
        type: data[1].type,
        targetId: data[1].id,
    },
    {
        id: `label-${data[2].id}`,
        type: data[2].type,
        targetId: data[2].id,
    },
    {
        id: `label-${data[3].id}`,
        type: data[3].type,
        targetId: data[3].id,
    },
];

export default { data, initialLabels };