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
		data: { containerId },
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
					fillRule="evenodd"
					clipRule="evenodd"
					d="M0.86438 13.5107V53.3902L12.5862 65.148H94.0878H109.683H283.419L295.14 53.3902V13.5107L281.994 0.323486H109.683H94.0878H14.0112L0.86438 13.5107Z"
					fill="white"
				/>
			</svg>
			<span className={styles.labelText}>{label}</span>
		</div>
	);
};

export default SortableLabel;
