import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./SortableLabel.module.css";

interface SortableLabelProps {
	id: string;
	label: string;
	containerId?: string;
}

const SortableLabel = ({ id, label, containerId }: SortableLabelProps) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
		data: {
			containerId,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`${styles.sortableLabel} ${isDragging ? styles.dragging : ""}`}
			{...attributes}
			{...listeners}
			data-container-id={containerId}
		>
			{label}
		</div>
	);
};

export default SortableLabel;
