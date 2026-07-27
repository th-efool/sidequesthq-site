import styles from "./Skeleton.module.css";

export function Skeleton({ variant = "section" }: { variant?: "hero" | "section" | "sidebar" | "feed" }) {
    return (
        <div className={`${styles.skeleton} ${styles[variant]}`} aria-hidden="true">
            <span />
            <span />
            <span />
        </div>
    );
}
