import type { FeedItem } from "../../models/cohort";
import { FeedCard } from "../FeedCards/FeedCard";
import styles from "./Feed.module.css";
export function Feed({ items }: { items: FeedItem[] }) { return <section className={styles.section}><div className={styles.header}><span>Chronological feed</span><h2>What is happening next</h2><p>Lessons, checkpoints, resources, and community prompts in one learning timeline.</p></div><div className={styles.timeline}>{items.map((item) => <FeedCard key={item.id} item={item} />)}</div></section>; }
