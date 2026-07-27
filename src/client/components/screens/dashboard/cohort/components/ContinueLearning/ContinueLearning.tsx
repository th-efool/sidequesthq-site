import { ArrowRight, Clock3, MapPinned } from "lucide-react";

import type { ProgressSummary } from "../../models/cohort";
import styles from "./ContinueLearning.module.css";

export function ContinueLearning({ progress }: { progress: ProgressSummary }) {
    const remainingMinutes = Math.max(0, progress.dailyGoalMinutes - progress.minutesToday);

    return (
        <section className={styles.card} aria-label="Continue learning">
            <div className={styles.copy}>
                <span className={styles.eyebrow}>Primary next action</span>
                <h2>{progress.currentLessonTitle}</h2>
                <p>{progress.currentLessonDuration} · estimated completion {progress.estimatedCompletion}</p>
            </div>

            <div className={styles.meta}>
                <span><MapPinned size={17} /> {progress.nextMilestone}</span>
                <span><Clock3 size={17} /> {remainingMinutes > 0 ? `${remainingMinutes} min left today` : "Daily goal complete"}</span>
            </div>

            <button type="button">
                Continue lesson
                <ArrowRight size={17} />
            </button>
        </section>
    );
}
