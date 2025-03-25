import {useState, FC, useEffect} from "react";
import {
	DndContext,
	pointerWithin,
	DragEndEvent,
	DragStartEvent,
	DragOverlay,
	useSensor,
	useSensors,
	PointerSensor,
	TouchSensor,
	MouseSensor,
	KeyboardSensor,
	useDroppable,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import CoffeeCard from "./CoffeeCard/CoffeeCard";
import SortableLabel from "@components/SortableLabel/SortableLabel";
import styles from "./game.module.css";
import { Data, InitialLabels } from "@components/pages/GamePage/types/types";
import closeButton from "@assets/img/close-button.svg";
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

// Начальное состояние контейнеров для целевых плашек
const initialTargetContainers: TargetContainer[] = [
	{ id: "container-0", labelId: null },
	{ id: "container-1", labelId: null },
	{ id: "container-2", labelId: null },
	{ id: "container-3", labelId: null },
];

// Компонент для целевого контейнера
const DroppableContainer = ({
	id,
	children,
	isDroppable,
}: {
	id: string;
	children: React.ReactNode;
	isDroppable: boolean;
}) => {
	// Используем хук из dnd-kit для создания контейнера, в который можно что-то перетаскивать
	const { setNodeRef } = useDroppable({
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
			{children}
		</div>
	);
};

interface Game {
	currentData: {
		data: Data[];
		initialLabels: InitialLabels[];
	};
	currentStage: number,
	setWin: (value: boolean) => void;
}

const Game: FC<Game> = ({ currentData, currentStage, setWin }) => {
	const {
		data: content
	} = useGetContent()

	const titlesByStage: { [key: number]: string } = {
		1: (content?.firstTask?.firstTaskTitle ?? ""),
		2: (content?.secondTask?.secondTaskTitle ?? ""),
		3: (content?.thirdTask?.thirdTaskTitle ?? ""),
		4: (content?.fourthTask?.fourthTaskTitle ?? "")
	}

	const descriptions = [
		(content?.firstTask?.firstTaskFooter ?? ""),
		(content?.secondTask?.secondTaskFooter ?? ""),
		(content?.thirdTask?.thirdTaskFooter ?? ""),
		(content?.fourthTask?.fourthTaskFooter ?? ""),
	]

	const buttons = [
		(content?.firstTask?.firstTaskBtn ?? ""),
		(content?.secondTask?.secondTaskBtn ?? ""),
		(content?.thirdTask?.thirdTaskBtn ?? ""),
		(content?.fourthTask?.fourthTaskBtn ?? ""),
	]

	const { data, initialLabels } = currentData;

	const {
		mutateAsync: getCupons,
		isPending: loadCupons,
		error: errorCupons
	} = useGetCupons()

	// Перемешиваем плашки при каждом рендере компонента
	const [shuffledLabels, setShuffledLabels] = useState(() => shuffleArray([...initialLabels]));

	// Состояние для перемещенных плашек (вышедших из исходного контейнера)
	const [movedLabels, setMovedLabels] = useState<string[]>([]);

	// Состояние для отслеживания позиций плашек в исходном контейнере
	const [labelPositions, setLabelPositions] = useState<Record<string, number>>(() =>
		shuffledLabels.reduce((acc, label, index) => {
			acc[label.id] = index;
			return acc;
		}, {} as Record<string, number>)
	);

	// Состояние для целевых контейнеров
	const [targetContainers, setTargetContainers] = useState(initialTargetContainers);

	// Состояние для активной плашки при перетаскивании
	const [activeId, setActiveId] = useState<string | null>(null);
	const [activeLabel, setActiveLabel] = useState<any>(null);

	// Состояние для отслеживания правильных ответов
	const [isChecked, setIsChecked] = useState(false);
	const [showModal, setShowModal] = useState(false);

	// Сбрасываем состояния при изменении уровня
	useEffect(() => {
		const newShuffledLabels = shuffleArray([...initialLabels]);
		setShuffledLabels(newShuffledLabels);

		setMovedLabels([]);

		setLabelPositions(
			newShuffledLabels.reduce((acc, label, index) => {
				acc[label.id] = index;
				return acc;
			}, {} as Record<string, number>)
		);

		setTargetContainers(initialTargetContainers);

		setIsChecked(false);
		setShowModal(false);

		setActiveId(null);
		setActiveLabel(null);
	}, [currentData, initialLabels]);

	// Обработчик начала перетаскивания
	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
		const draggedLabel =
			shuffledLabels.find((label) => label.id === event.active.id) ||
			shuffledLabels.find((label) => label.id === event.active.id);
		setActiveLabel(draggedLabel);
	};

	// Обработчик окончания перетаскивания
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);
		setActiveLabel(null);

		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		// Перетаскивание из исходного контейнера в целевой
		if (
			shuffledLabels.some((label) => label.id === activeId) &&
			!movedLabels.includes(activeId)
		) {
			// Проверяем, является ли цель контейнером
			if (overId.startsWith("container-")) {
				const containerIndex = parseInt(overId.split("-")[1]);

				// Проверяем, есть ли уже метка в этом контейнере
				if (targetContainers[containerIndex].labelId !== null) {
					const existingLabelId = targetContainers[containerIndex].labelId;

					// Сохраняем позицию активной метки, чтобы существующая метка заняла эту позицию
					const activePosition = labelPositions[activeId];

					// Возвращаем существующую метку в исходный контейнер на место перемещаемой метки
					if (existingLabelId) {
						// Удаляем текущую метку из списка перемещенных
						setMovedLabels((prev) => prev.filter((id) => id !== existingLabelId));

						// Обновляем позиции: существующая метка занимает позицию активной
						setLabelPositions((prev) => ({
							...prev,
							[existingLabelId]: activePosition,
						}));
					}

					// Добавляем новую метку в список перемещенных
					setMovedLabels((prev) => [...prev, activeId]);

					// Заменяем метку в контейнере
					setTargetContainers((prevContainers) => {
						const newContainers = [...prevContainers];
						newContainers[containerIndex].labelId = activeId;
						return newContainers;
					});

					// Сбрасываем проверку при перетаскивании
					if (isChecked) {
						setIsChecked(false);
					}

					return;
				}

				// Если контейнер пустой, то просто добавляем метку
				setTargetContainers((prevContainers) => {
					const newContainers = [...prevContainers];
					newContainers[containerIndex].labelId = activeId;
					return newContainers;
				});

				// Добавляем метку в список перемещенных
				setMovedLabels((prev) => [...prev, activeId]);

				// Сбрасываем проверку при перетаскивании
				if (isChecked) {
					setIsChecked(false);
				}
			}
		} else {
			// Перетаскивание между целевыми контейнерами
			// Находим контейнер, из которого перетаскиваем
			const sourceContainerIndex = targetContainers.findIndex(
				(container) => container.labelId === activeId
			);

			if (sourceContainerIndex !== -1 && overId.startsWith("container-")) {
				const targetContainerIndex = parseInt(overId.split("-")[1]);

				// Если уже есть метка в целевом контейнере, меняем их местами
				if (targetContainers[targetContainerIndex].labelId !== null) {
					// Меняем метки местами
					setTargetContainers((prevContainers) => {
						const newContainers = [...prevContainers];
						const targetLabelId = newContainers[targetContainerIndex].labelId;

						newContainers[targetContainerIndex].labelId = activeId;
						newContainers[sourceContainerIndex].labelId = targetLabelId;

						return newContainers;
					});
				} else {
					// Если контейнер пустой, просто перемещаем метку
					setTargetContainers((prevContainers) => {
						const newContainers = [...prevContainers];
						newContainers[targetContainerIndex].labelId = activeId;
						newContainers[sourceContainerIndex].labelId = null;
						return newContainers;
					});
				}

				// Сбрасываем проверку
				if (isChecked) {
					setIsChecked(false);
				}
			}
		}
	};

	// Инициализируем сенсоры для перетаскивания
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 1,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 100,
				tolerance: 1,
			},
		}),
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
			await getCupons(currentStage)
			setWin(true);
		} else {
			setShowModal(true);
		}
	};

	// Обработка закрытия модального окна
	const handleCloseModal = () => {
		setShowModal(false);
		setIsChecked(false);
	};

	// Получаем плашку для контейнера
	const getLabelForContainer = (containerId: string) => {
		const containerIndex = parseInt(containerId.split("-")[1]);
		const labelId = targetContainers[containerIndex].labelId;

		if (labelId) {
			return shuffledLabels.find((label) => label.id === labelId);
		}

		return null;
	};

	return (
		<div className={styles.gameContainer}>
			<div className={styles.gameContent}>
				<h2 dangerouslySetInnerHTML={{ __html: (titlesByStage[currentStage - 1] ?? "")  }} className={styles.title}>
				</h2>

				<DndContext
					collisionDetection={pointerWithin}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
					sensors={sensors}
				>
					{/* Контейнер с изображениями кофе и контейнерами для плашек */}
					<div className={styles.gameLayout}>
						{/* Исходный контейнер с плашками вверху */}
						<div className={styles.sourceContainer}>
							{/* Создаем массив со слотами для плашек */}
							{Array.from({ length: shuffledLabels.length }).map((_, slotIndex) => {
								// Находим ID плашки, которая должна быть в этом слоте
								const labelId = Object.entries(labelPositions).find(
									([id, position]) =>
										position === slotIndex && !movedLabels.includes(id)
								)?.[0];

								// Находим информацию о плашке по ID
								const label = labelId
									? shuffledLabels.find((l) => l.id === labelId)
									: null;

								return (
									<div
										className={styles.labelSourceContainer}
										key={`slot-${slotIndex}`}
									>
										{label && activeId !== label.id ? (
											<SortableLabel
												key={label.id}
												id={label.id}
												label={label.type}
												containerId="source"
											/>
										) : (
											<div className={styles.emptySpace}></div>
										)}
									</div>
								);
							})}
						</div>

						{/* Контейнер с карточками кофе */}
						<div className={styles.coffeeCardsContainer}>
							{data.map((coffee, index) => {
								const containerId = `container-${index}`;
								const label = getLabelForContainer(containerId);

								return (
									<div key={coffee.id} className={styles.coffeeCardWrapper}>
										<DroppableContainer
											id={containerId}
											isDroppable={!isChecked}
										>
											{/* Показываем метку, если она есть в этом контейнере */}
											{label && activeId !== label.id && (
												<SortableContext
													items={[label.id]}
													strategy={rectSortingStrategy}
												>
													<SortableLabel
														id={label.id}
														label={label.type}
														containerId={containerId}
													/>
												</SortableContext>
											)}
										</DroppableContainer>
										<CoffeeCard image={coffee.image} />
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
					<span dangerouslySetInnerHTML={{ __html: (buttons[currentStage - 1] ?? "") }} className={styles.buttonText}></span>
					{
						loadCupons
						&&
						<div className={styles.loader}>
							<Loader />
						</div>
					}
				</button>
				{
					errorCupons
					&&
					<p className={styles.description_error}>
						Адбылася памылка. Паспрабуйце адправіць адказ зноў
					</p>
				}
				<p dangerouslySetInnerHTML={{ __html: (descriptions[currentStage] ?? "") }} className={styles.description}>
				</p>
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
								<img src={closeButton} alt="Close" />
							</button>
							<h3 className={styles.modalTitle}>
								Нешта пайшло не так, паспрабуйце выканаць заданне зноў!
								<br />У вас усё атрымаецца!
							</h3>
							<button className={styles.bonusButton} onClick={handleCloseModal}>
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
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Game;
