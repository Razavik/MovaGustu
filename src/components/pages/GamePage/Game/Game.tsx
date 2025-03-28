import {useState, FC, useEffect, Dispatch, SetStateAction} from "react";
import {X} from "lucide-react"
import {
    DndContext,
    pointerWithin,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    useSensor,
    useSensors,
    TouchSensor,
    MouseSensor,
    KeyboardSensor,
    useDroppable,
} from "@dnd-kit/core";
import {SortableContext, rectSortingStrategy} from "@dnd-kit/sortable";
import CoffeeCard from "./CoffeeCard/CoffeeCard";
import SortableLabel from "@components/SortableLabel/SortableLabel";
import styles from "./game.module.css";
import {Data, InitialLabels} from "@components/pages/GamePage/types/types";
import Loader from "@components/Loader/Loader.tsx";
import {useGetCupons} from "../../../../hooks/useGetCupons.ts";
import {useGetContent} from "../../../../hooks/useGetContent.ts";

// Функция для перемешивания массива (алгоритм Фишера-Йейтса)
const shuffleArray = <T extends unknown>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Типы для контейнеров
interface TargetContainer {
    id: string;
    labelId: string | null;
}

interface SourceContainer {
    id: string;
    coffeeId: string;
    labelId: string | null;
}

// Начальное состояние контейнеров для целевых плашек
const initialTargetContainers: TargetContainer[] = [
    {id: "container-0", labelId: null},
    {id: "container-1", labelId: null},
    {id: "container-2", labelId: null},
    {id: "container-3", labelId: null},
];

// Компонент для целевого контейнера
const DroppableContainer = ({
    id,
    children,
    isDroppable,
    isBackground = true,
}: {
    id: string;
    children: React.ReactNode;
    isDroppable: boolean;
    isBackground?: boolean;
}) => {
    // Используем хук из dnd-kit для создания контейнера, в который можно что-то перетаскивать
    const {setNodeRef} = useDroppable({
        id,
        disabled: !isDroppable,
    });

    return (
        <div
            ref={setNodeRef}
            id={id}
            data-id={id}
            className={`${styles.labelContainer} ${isDroppable ? styles.droppable : ""}`}
        >
            {isBackground && (
                <svg
                    width="296"
                    height="66"
                    viewBox="0 0 296 66"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        filter: "drop-shadow(0 4px 2px rgba(0, 0, 0, 0.6))",
                        pointerEvents: "none",
                    }}
                >
                    <path
                        d="M12.7937 64.648L1.36438 53.1836V13.7174L14.2188 0.823486H281.786L294.64 13.7174V53.1835L283.211 64.648H12.7937Z"
                        stroke="white"
                    />
                </svg>
            )}
            {children}
        </div>
    );
};

interface Game {
    currentData: {
        data: Data[];
        initialLabels: InitialLabels[];
    };
    setCurrentStage: Dispatch<SetStateAction<number>>
    currentStage: number;
    setWin: (value: boolean) => void;
}

const Game: FC<Game> = ({currentData, setCurrentStage, currentStage, setWin}) => {
    const {data: content} = useGetContent();

    const titlesByStage: { [key: number]: string } = {
        1: content?.firstTask?.firstTaskTitle ?? "",
        2: content?.secondTask?.secondTaskTitle ?? "",
        3: content?.thirdTask?.thirdTaskTitle ?? "",
        4: content?.fourthTask?.fourthTaskTitle ?? "",
    };

    console.log(titlesByStage);

    const descriptions = [
        content?.firstTask?.firstTaskFooter ?? "",
        content?.secondTask?.secondTaskFooter ?? "",
        content?.thirdTask?.thirdTaskFooter ?? "",
        content?.fourthTask?.fourthTaskFooter ?? "",
    ];

    console.log("WHY")

    const buttons = [
        content?.firstTask?.firstTaskBtn ?? "",
        content?.secondTask?.secondTaskBtn ?? "",
        content?.thirdTask?.thirdTaskBtn ?? "",
        content?.fourthTask?.fourthTaskBtn ?? "",
    ];

    const {data, initialLabels} = currentData;

    const {mutateAsync: getCupons, isPending: loadCupons, error: errorCupons} = useGetCupons();

    // Перемешиваем плашки при каждом рендере компонента
    const [shuffledLabels, setShuffledLabels] = useState<InitialLabels[]>([]);
    const [movedLabels, setMovedLabels] = useState<string[]>([]);
    const [targetContainers, setTargetContainers] =
        useState<TargetContainer[]>(initialTargetContainers);
    const [sourceContainers, setSourceContainers] = useState<SourceContainer[]>([]);

    // Состояния перетаскивания
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeLabel, setActiveLabel] = useState<InitialLabels | null>(null);

    // Состояние для отслеживания правильных ответов
    const [isChecked, setIsChecked] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Сброс игры к начальному состоянию
    const resetGame = () => {
        // Перемешиваем плашки
        const newShuffledLabels = shuffleArray([...initialLabels]);
        setShuffledLabels(newShuffledLabels);
        setSourceContainers(sourceContainers.map((container, index) => ({
            ...container,
            labelId: newShuffledLabels[index].id
        })))

        // Сбрасываем состояние перемещенных плашек - важно сделать это до сброса контейнеров
        setMovedLabels([]);

        // Сбрасываем целевые контейнеры - делаем это ПЕРЕД обновлением позиций
        const newTargetContainers = initialTargetContainers.map((container) => ({
            ...container,
            labelId: null,
        }));
        setTargetContainers(newTargetContainers);

        // Сбрасываем состояния проверки
        setIsChecked(false);
        setShowModal(false);

        // Сбрасываем активную плашку
        setActiveId(null);
        setActiveLabel(null);
    };

    // Инициализация игры
    useEffect(() => {
        // Сбрасываем состояния при смене уровня
        setIsChecked(false);
        setMovedLabels([]);
        setActiveId(null);
        setActiveLabel(null);

        // Перемешиваем плашки
        const shuffled = shuffleArray([...initialLabels]);
        setShuffledLabels(shuffled);

        // Сбрасываем целевые контейнеры
        const resetTargetContainers = initialTargetContainers.map((container) => ({
            ...container,
            labelId: null,
        }));
        setTargetContainers(resetTargetContainers);

        // Инициализируем исходные контейнеры
        const initialSourceContainers = data.map((coffee, index) => ({
            id: `source-${coffee.id}`,
            coffeeId: coffee.id,
            labelId: shuffled[index]?.id || null, // Просто берем плашку с соответствующим индексом
        }));
        setSourceContainers(initialSourceContainers);
    }, [initialLabels, data]);

    // Обработчик начала перетаскивания
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
        const draggedLabel = shuffledLabels.find((label) => label.id === event.active.id) || null;
        setActiveLabel(draggedLabel);
    };

    console.log(activeLabel)

    // Обработка завершения перетаскивания
    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        // Сбрасываем активные состояния
        setActiveId(null);
        setActiveLabel(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Определяем тип контейнеров
        const isSourceContainer = (id: string) => id.startsWith("source-");
        const isTargetContainer = (id: string) => id.startsWith("container-");

        // Находим контейнеры источника и назначения
        const activeSourceIndex = sourceContainers.findIndex(
            (container) => container.labelId === activeId
        );
        const activeTargetIndex = targetContainers.findIndex(
            (container) => container.labelId === activeId
        );
        const isActiveFromSource = activeSourceIndex !== -1;
        const isActiveFromTarget = activeTargetIndex !== -1;

        // Извлекаем id исходных и целевых контейнеров
        const overIsSource = isSourceContainer(overId);
        const overIsTarget = isTargetContainer(overId);

        // Извлекаем индексы контейнеров назначения
        const overSourceIndex = overIsSource
            ? sourceContainers.findIndex((c) => c.id === overId)
            : -1;
        const overTargetIndex = overIsTarget ? parseInt(overId.split("-")[1]) : -1;

        // 1. Перемещение в исходный контейнер
        if (overIsSource) {
            // Копируем состояния
            const newSourceContainers = [...sourceContainers];
            const newTargetContainers = [...targetContainers];

            // Если плашка перемещается из целевого контейнера в исходный
            if (isActiveFromTarget) {
                // Если в исходном уже есть плашка - меняем местами
                if (
                    newSourceContainers[overSourceIndex].labelId &&
                    newSourceContainers[overSourceIndex].labelId !== activeId
                ) {
                    // Перемещаем плашку из исходного в целевой
                    const sourceLabelId = newSourceContainers[overSourceIndex].labelId;
                    newTargetContainers[activeTargetIndex].labelId = sourceLabelId;

                    // Добавляем в перемещенные
                    if (sourceLabelId && !movedLabels.includes(sourceLabelId)) {
                        setMovedLabels((prev) => [...prev, sourceLabelId]);
                    }
                } else {
                    // Просто очищаем целевой контейнер
                    newTargetContainers[activeTargetIndex].labelId = null;
                }

                // Устанавливаем активную плашку в исходный контейнер
                newSourceContainers[overSourceIndex].labelId = activeId;

                // Обновляем состояние
                setSourceContainers(newSourceContainers);
                setTargetContainers(newTargetContainers);

                // Удаляем из перемещенных
                setMovedLabels((prev) => prev.filter((id) => id !== activeId));
            }
            // Если плашка перемещается из одного исходного контейнера в другой
            else if (isActiveFromSource) {
                // Копируем состояние исходных контейнеров
                const newSourceContainers = [...sourceContainers];

                // Если в целевом исходном уже есть плашка - меняем местами
                if (
                    newSourceContainers[overSourceIndex].labelId &&
                    newSourceContainers[overSourceIndex].labelId !== activeId
                ) {
                    // Получаем id плашки в целевом исходном контейнере
                    const overLabelId = newSourceContainers[overSourceIndex].labelId;

                    // Меняем плашки местами
                    newSourceContainers[activeSourceIndex].labelId = overLabelId;
                    newSourceContainers[overSourceIndex].labelId = activeId;
                } else {
                    // Просто перемещаем плашку
                    newSourceContainers[activeSourceIndex].labelId = null;
                    newSourceContainers[overSourceIndex].labelId = activeId;
                }

                // Обновляем состояние
                setSourceContainers(newSourceContainers);
            }
        }
        // 2. Перемещение в целевой контейнер
        else if (overIsTarget) {
            // Копируем состояния
            const newSourceContainers = [...sourceContainers];
            const newTargetContainers = [...targetContainers];

            // Получаем текущую плашку в целевом контейнере (если есть)
            const currentLabelInTarget = newTargetContainers[overTargetIndex].labelId;

            // Если плашка перемещается из исходного контейнера
            if (isActiveFromSource) {
                // Если в целевом уже есть плашка - меняем местами
                if (currentLabelInTarget) {
                    // Перемещаем плашку из целевого в исходный
                    newSourceContainers[activeSourceIndex].labelId = currentLabelInTarget;

                    // Удаляем из перемещенных
                    setMovedLabels((prev) => prev.filter((id) => id !== currentLabelInTarget));
                } else {
                    // Очищаем исходный контейнер
                    newSourceContainers[activeSourceIndex].labelId = null;
                }

                // Помещаем активную плашку в целевой
                newTargetContainers[overTargetIndex].labelId = activeId;

                // Добавляем в перемещенные
                if (!movedLabels.includes(activeId)) {
                    setMovedLabels((prev) => [...prev, activeId]);
                }
            }
            // Если плашка перемещается из одного целевого в другой
            else if (isActiveFromTarget) {
                // Если в целевом уже есть плашка - меняем местами
                if (currentLabelInTarget) {
                    // Меняем местами
                    newTargetContainers[activeTargetIndex].labelId = currentLabelInTarget;
                } else {
                    // Очищаем исходный целевой
                    newTargetContainers[activeTargetIndex].labelId = null;
                }

                // Помещаем активную плашку в целевой
                newTargetContainers[overTargetIndex].labelId = activeId;
            }

            // Обновляем состояния
            setSourceContainers(newSourceContainers);
            setTargetContainers(newTargetContainers);
        }

        // Сбрасываем проверку при перетаскивании
        if (isChecked) {
            setIsChecked(false);
        }
    };

    // Инициализируем сенсоры для перетаскивания
    const sensors = useSensors(
        useSensor(TouchSensor),
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 1,
            },
        }),
        useSensor(KeyboardSensor)
    );

    // Проверка правильности расположения плашек
    const checkAnswers = async () => {
        // Проверяем, все ли плашки размещены
        const allPlaced = targetContainers.every((container) => container.labelId !== null);

        if (!allPlaced) {
            setShowModal(true);
            return;
        }

        const newResults: Record<string, boolean> = {};
        let correctCount = 0;

        // Проверяем, соответствует ли каждая плашка своему контейнеру
        targetContainers.forEach((container, index) => {
            const labelId = container.labelId;

            if (labelId) {
                const label = shuffledLabels.find((l) => l.id === labelId);
                const coffee = data[index];

                if (label) {
                    const isCorrect = label.targetId === coffee.id;
                    newResults[labelId] = isCorrect;

                    if (isCorrect) {
                        correctCount++;
                    }
                }
            }
        });

        setIsChecked(true);

        // Если все ответы правильные
        if (correctCount === data.length) {
            await getCupons(currentStage);
            setWin(true);
        } else {
            setShowModal(true);
        }
    };

    // Обработка закрытия модального окна
    const handleCloseModal = () => {
        resetGame(); // Сбрасываем игру к начальному состоянию
    };

    const handleGoToBonus = () => {
        if (currentStage === 1) {
            resetGame()
        } else {
            setWin(true)
            setCurrentStage(currentStage - 1)
        }

    }

    // Получаем текущую плашку в исходном контейнере по ID
    const getLabelForSourceContainer = (sourceId: string) => {
        const container = sourceContainers.find((c) => c.id === sourceId);
        if (container && container.labelId) {
            return shuffledLabels.find((label) => label.id === container.labelId);
        }
        return null;
    };

    console.log(sourceContainers, "SOURCE")

    return (
        <div className={styles.gameContainer}>
            <div className={styles.gameContent}>
                <h2
                    dangerouslySetInnerHTML={{__html: titlesByStage[currentStage] ?? ""}}
                    className={styles.title}
                ></h2>

                <DndContext
                    collisionDetection={pointerWithin}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                >
                    {/* Контейнер с карточками кофе и контейнерами для плашек */}
                    <div className={styles.gameLayout}>
                        {/* Отображаем карточки кофе с исходными и целевыми контейнерами */}
                        <div className={styles.coffeeCardsContainer}>
                            {data.map((coffee, index) => {
                                return (
                                    <div key={coffee.id} className={styles.coffeeCardWrapper}>
                                        {/* Исходный контейнер для этого кофе */}
                                        <div className={styles.sourceTargetContainer}>
                                            <DroppableContainer
                                                id={`source-${coffee.id}`}
                                                isDroppable={true}
                                                isBackground={false}
                                            >
                                                {(() => {
                                                    const sourceContainerId = `source-${coffee.id}`;
                                                    const sourceLabel =
                                                        getLabelForSourceContainer(
                                                            sourceContainerId
                                                        );

                                                    return (
                                                        sourceLabel &&
                                                        activeId !== sourceLabel.id && (
                                                            <SortableContext
                                                                items={[sourceLabel.id]}
                                                                strategy={rectSortingStrategy}
                                                            >
                                                                <SortableLabel
                                                                    id={sourceLabel.id}
                                                                    label={sourceLabel.type}
                                                                    containerId={sourceContainerId}
                                                                />
                                                            </SortableContext>
                                                        )
                                                    );
                                                })()}

                                                {activeId && (
                                                    <div className={styles.ghostLabel}></div>
                                                )}
                                            </DroppableContainer>

                                            {/* Целевой контейнер для этого кофе */}
                                            <DroppableContainer
                                                id={`container-${index}`}
                                                isDroppable={!isChecked}
                                            >
                                                {(() => {
                                                    const targetContainer = targetContainers[index];
                                                    const targetLabelId = targetContainer?.labelId;
                                                    const targetLabel = targetLabelId
                                                        ? shuffledLabels.find(
                                                            (label) =>
                                                                label.id === targetLabelId
                                                        )
                                                        : null;

                                                    return (
                                                        targetLabel && (
                                                            <SortableContext
                                                                items={[targetLabel.id]}
                                                                strategy={rectSortingStrategy}
                                                            >
                                                                {activeId === targetLabel.id ? (
                                                                    // Плашка-призрак на месте перетаскиваемой плашки
                                                                    <div
                                                                        className={
                                                                            styles.ghostLabel
                                                                        }
                                                                    ></div>
                                                                ) : (
                                                                    <SortableLabel
                                                                        id={targetLabel.id}
                                                                        label={targetLabel.type}
                                                                        containerId={`container-${index}`}
                                                                    />
                                                                )}
                                                            </SortableContext>
                                                        )
                                                    );
                                                })()}
                                            </DroppableContainer>
                                        </div>

                                        {/* Изображение кофе */}
                                        <CoffeeCard image={coffee.image}/>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Оверлей для перетаскиваемой плашки */}
                    <DragOverlay>
                        {activeId && activeLabel ? (
                            <div className={styles.dragOverlay}>
                                <SortableLabel
                                    id={activeId}
                                    label={activeLabel.type}
                                    containerId=""
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>

                <button disabled={loadCupons} className={styles.checkButton} onClick={checkAnswers}>
                    <svg
                        width="296"
                        height="66"
                        viewBox="0 0 296 66"
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
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M0 18.8832V53.3902L12.5862 65.148H94.0878H109.683H283.419L295.14 53.3902V18.8832L281.994 0.323486H109.683H94.0878H14.0112L0 18.8832Z"
                            fill="white"
                        />
                    </svg>
                    <span
                        dangerouslySetInnerHTML={{__html: buttons[currentStage - 1] ?? ""}}
                        className={styles.buttonText}
                    ></span>
                    {loadCupons && (
                        <div className={styles.loader}>
                            <Loader/>
                        </div>
                    )}
                </button>
                {errorCupons && (
                    <p className={styles.description_error}>
                        Адбылася памылка. Паспрабуйце адправіць адказ зноў
                    </p>
                )}
                <p
                    dangerouslySetInnerHTML={{__html: descriptions[currentStage - 1] ?? ""}}
                    className={styles.description}
                ></p>
                {/* Модальное окно с ошибкой */}
                {showModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <svg
                                width="874"
                                height="455"
                                viewBox="0 0 874 455"
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
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M0 48.9774V405.817L48.8726 454.84H479.206H560.427H823.681L873.71 404.657V48.9774L824.882 0H560.427H479.206H48.8275L0 48.9774Z"
                                    fill="white"
                                />
                            </svg>
                            <button className={styles.closeButton} onClick={handleCloseModal}>
                                <X strokeWidth={1.5} width={50} height={50} className={styles.x}/>
                                {/*<img src={closeButton} alt="Close" />*/}
                            </button>
                            <h3 className={styles.modalTitle}>
                                Нешта пайшло не так, паспрабуйце выканаць заданне зноў!
                                <br/>У вас усё атрымаецца!
                            </h3>
                            {
                                currentStage !== 1
                                &&
                                <button className={styles.bonusButton} onClick={handleGoToBonus}>
                                    <svg
                                        width="765"
                                        height="93"
                                        viewBox="0 0 765 93"
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
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M0 18.8832V75.9878L16.7851 92.8244H747.945L764.73 75.9878V18.8832L745.905 0H18.8254L0 18.8832Z"
                                            fill="white"
                                        />
                                    </svg>

                                    <span>Ці забраць ужо атрыманы бонус</span>
                                </button>
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Game;
