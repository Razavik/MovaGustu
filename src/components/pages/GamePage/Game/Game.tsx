import { useState } from "react";
import {
	DndContext,
	rectIntersection,
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

// Импортируем изображения
import img1 from "@assets/img/level-1/картинка 1.png";
import img2 from "@assets/img/level-1/картинка 2.png";
import img3 from "@assets/img/level-1/картинка 3.png";
import img4 from "@assets/img/level-1/картинка 4.png";

// Данные о карточках кофе
const coffeeData = [
	{
		id: "light",
		type: "Светлая",
		image: img1,
	},
	{
		id: "medium",
		type: "Сярэдняя",
		image: img2,
	},
	{
		id: "green",
		type: "Зялёнае зерне",
		image: img3,
	},
	{
		id: "whole",
		type: "Цёмная",
		image: img4,
	},
];

// Данные о плашках с названиями
const initialLabels = [
	{
		id: "label-light",
		type: "Светлая",
		targetId: "light",
	},
	{
		id: "label-medium",
		type: "Сярэдняя",
		targetId: "medium",
	},
	{
		id: "label-green",
		type: "Зялёнае зерне",
		targetId: "green",
	},
	{
		id: "label-whole",
		type: "Цёмная",
		targetId: "whole",
	},
];

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
			{children}
		</div>
	);
};

const Game = ({ setWin }: { setWin: (win: boolean) => void }) => {
	// Состояние для перемещенных плашек (вышедших из исходного контейнера)
	const [movedLabels, setMovedLabels] = useState<string[]>([]);

	// Состояние для отслеживания позиций плашек в исходном контейнере
	const [labelPositions, setLabelPositions] = useState<Record<string, number>>(
		initialLabels.reduce((acc, label, index) => {
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

	// Обработчик начала перетаскивания
	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
		const draggedLabel =
			initialLabels.find((label) => label.id === event.active.id) ||
			initialLabels.find((label) => label.id === event.active.id);
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
			initialLabels.some((label) => label.id === activeId) &&
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

	// Настраиваем сенсоры
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 1 },
		}),
		useSensor(TouchSensor),
		useSensor(MouseSensor),
		useSensor(KeyboardSensor)
	);

	// Проверка правильности расположения плашек
	const checkAnswers = () => {
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
				const label = initialLabels.find((l) => l.id === labelId);
				const coffee = coffeeData[index];

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
		if (correctCount === coffeeData.length) {
			setWin(true);
		} else {
			setShowModal(true);
		}
	};

	// Обработка закрытия модального окна
	const handleCloseModal = () => {
		setShowModal(false);
	};

	// Получаем плашку для контейнера
	const getLabelForContainer = (containerId: string) => {
		const containerIndex = parseInt(containerId.split("-")[1]);
		const labelId = targetContainers[containerIndex].labelId;

		if (labelId) {
			return initialLabels.find((label) => label.id === labelId);
		}

		return null;
	};

	return (
		<div className={styles.gameContainer}>
			<div className={styles.gameContent}>
				<h2 className={styles.title}>
					Суаднясіце <b>ступень абсмажвання кавы</b> з малюнкамі і атрымайце бонусы
				</h2>

				<DndContext
					collisionDetection={rectIntersection}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
					sensors={sensors}
				>
					{/* Контейнер с изображениями кофе и контейнерами для плашек */}
					<div className={styles.gameLayout}>
						{/* Исходный контейнер с плашками вверху */}
						<div className={styles.sourceContainer}>
							{/* Создаем массив со слотами для плашек */}
							{Array.from({ length: initialLabels.length }).map((_, slotIndex) => {
								// Находим ID плашки, которая должна быть в этом слоте
								const labelId = Object.entries(labelPositions).find(
									([id, position]) =>
										position === slotIndex && !movedLabels.includes(id)
								)?.[0];

								// Находим информацию о плашке по ID
								const label = labelId
									? initialLabels.find((l) => l.id === labelId)
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
							{coffeeData.map((coffee, index) => {
								const containerId = `container-${index}`;
								const label = getLabelForContainer(containerId);

								return (
									<div key={coffee.id} className={styles.coffeeCardWrapper}>
										<DroppableContainer
											id={containerId}
											isDroppable={!isChecked}
										>
											{/* Показываем метку, если она есть в этом контейнере */}
											{!isChecked && label && (
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

				<button className={styles.checkButton} onClick={checkAnswers}>
					Праверыць
				</button>

				{/* Модальное окно с ошибкой */}
				{showModal && (
					<div className={styles.modalOverlay}>
						<div className={styles.modalContent}>
							<button className={styles.closeButton} onClick={handleCloseModal}>
								×
							</button>
							<h3 className={styles.modalTitle}>
								Нешта пайшло не так, паспрабуйце выканаць заданне зноў!
							</h3>
							<p className={styles.modalText}>У вас усё атрымаецца!</p>
							<button className={styles.bonusButton} onClick={handleCloseModal}>
								Ці забраць ужо атрыманы бонус
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Game;
