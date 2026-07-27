import type { ProgressSummary } from "../../models/cohort";
import styles from "./Progress.module.css";

function Metric({ label, value, helper }: { label: string; value: string; helper: string }) {
    return (
        <div className={styles.metric}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{helper}</small>
        </div>
    );
}

export function Progress({ progress }: { progress: ProgressSummary }) {
    const goalPercent = Math.min(100, Math.round((progress.minutesToday / progress.dailyGoalMinutes) * 100));
    const remainingMinutes = Math.max(0, progress.dailyGoalMinutes - progress.minutesToday);

    return (
        <section className={styles.section} aria-labelledby="cohort-progress-title">
            <div className={styles.header}>
                <div>
                    <span>Learning dashboard</span>
                    <h2 id="cohort-progress-title">Progress overview</h2>
                </div>
                <p>{progress.weeklyPaceLabel}</p>
            </div>

            <div className={styles.grid}>
                <div
                    className={styles.ring}
                    style={{ "--progress-deg": `${progress.percent * 3.6}deg` } as React.CSSProperties}
                    aria-label={`${progress.percent}% complete`}
                >
                    <div>
                        <strong>{progress.percent}%</strong>
                        <span>complete</span>
                    </div>
                </div>

                <Metric label="Current lesson" value={progress.currentLessonTitle} helper={progress.currentLessonDuration} />
                <Metric label="Study streak" value={`${progress.streakDays} days`} helper={progress.nextCheckpoint} />
                <Metric label="Hours" value={`${progress.hoursCompleted} done`} helper={`${progress.hoursRemaining} remaining`} />

                <div className={styles.goal}>
                    <div className={styles.goalCopy}>
                        <span>Today goal</span>
                        <strong>{progress.minutesToday}/{progress.dailyGoalMinutes} min</strong>
                        <small>{remainingMinutes > 0 ? `${remainingMinutes} min to keep the streak alive` : "Goal protected for today"}</small>
                    </div>
                    <div className={styles.rail} aria-hidden="true">
                        <i style={{ width: `${goalPercent}%` }} />
                    </div>
                </div>

                <div className={styles.consistency} aria-label="Weekly consistency">
                    {progress.consistency.map((value, index) => (
                        <span key={index} style={{ height: `${Math.max(18, value)}%` }} title={`${value}%`} />
                    ))}
                </div>
            </div>
        </section>
    );
}
