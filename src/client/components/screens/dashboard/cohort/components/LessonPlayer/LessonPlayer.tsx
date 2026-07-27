import { EmptyState } from "../EmptyState/EmptyState";
import styles from "./LessonPlayer.module.css";
export function LessonPlayer({ currentLessonTitle }: { currentLessonTitle: string }) { return <section className={styles.section}><div className={styles.header}><h2>Lesson Player</h2><p>Reserved embedded learning surface.</p></div><div className={styles.body}><EmptyState eyebrow="Player shell" title={currentLessonTitle} description="Media, transcripts, notes, and controls will be composed here later." /></div></section>; }
