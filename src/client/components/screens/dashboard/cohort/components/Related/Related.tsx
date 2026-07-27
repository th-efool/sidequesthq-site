import Link from "next/link";
import type { Recommendation } from "../../models/cohort";
import styles from "./Related.module.css";
export function Related({ cohorts }: { cohorts: Recommendation[] }) { return <section className={styles.section}><div className={styles.header}><span>Continue your journey</span><h2>Related cohorts</h2><p>Recommendations, similar cohorts, and useful prerequisites.</p></div><div className={styles.grid}>{cohorts.map((cohort) => <Link href={`/cohort/${cohort.id}`} className={styles.card} key={cohort.id}><img src={cohort.thumbnail} alt="" /><div><span>{cohort.kind}</span><h3>{cohort.title}</h3><p>{cohort.reason}</p><strong>{cohort.provider} · {cohort.durationLabel}</strong></div></Link>)}</div></section>; }
