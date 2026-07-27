import styles from "./EmptyState.module.css";

export function EmptyState({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
    return <div className={styles.empty}><span>{eyebrow}</span><h3>{title}</h3><p>{description}</p></div>;
}
