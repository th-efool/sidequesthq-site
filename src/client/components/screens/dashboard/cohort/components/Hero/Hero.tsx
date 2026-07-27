import { Bookmark, MessageCircle, Play, Share2, Star, Users } from "lucide-react";

import type { CohortDetail } from "../../models/cohort";
import styles from "./Hero.module.css";

export function Hero({ cohort }: { cohort: CohortDetail }) {
    const goalPercent = Math.min(100, Math.round((cohort.progress.minutesToday / cohort.progress.dailyGoalMinutes) * 100));

    return (
        <section className={styles.hero}>
            <img className={styles.banner} src={cohort.thumbnail} alt="" />
            <div className={styles.scrim} />
            <div className={styles.content}>
                <img className={styles.cover} src={cohort.thumbnail} alt="" />
                <div className={styles.copy}>
                    <div className={styles.meta}>
                        <span>{cohort.provider}</span>
                        <span>{cohort.difficulty}</span>
                        <span>{cohort.durationLabel}</span>
                    </div>
                    <h1>{cohort.title}</h1>
                    <p>{cohort.subtitle}</p>
                    <div className={styles.tags}>{cohort.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <div className={styles.instructor}>
                        <img src={cohort.creator.avatar} alt="" />
                        <span>Led by <strong>{cohort.creator.name}</strong> · {cohort.creator.role}</span>
                    </div>
                </div>
                <aside className={styles.momentum} aria-label="Cohort momentum">
                    <div className={styles.statRow}><Users size={16} /><span>{cohort.learnerCountLabel}</span></div>
                    <div className={styles.statRow}><Star size={16} fill="currentColor" /><span>{cohort.rating}</span></div>
                    <div className={styles.progressNumber}>{cohort.progress.percent}%</div>
                    <span className={styles.nextLabel}>Continue: {cohort.progress.currentLessonTitle}</span>
                    <div className={styles.goal}><span>Daily goal</span><strong>{cohort.progress.minutesToday}/{cohort.progress.dailyGoalMinutes} min</strong><div><i style={{ width: `${goalPercent}%` }} /></div></div>
                    <button className={styles.primary} type="button"><Play size={17} fill="currentColor" /> Resume lesson</button>
                    <div className={styles.actions}>
                        <button type="button"><MessageCircle size={17} /> Discuss</button>
                        <button type="button" aria-label="Bookmark"><Bookmark size={17} /></button>
                        <button type="button" aria-label="Share"><Share2 size={17} /></button>
                    </div>
                </aside>
            </div>
        </section>
    );
}
