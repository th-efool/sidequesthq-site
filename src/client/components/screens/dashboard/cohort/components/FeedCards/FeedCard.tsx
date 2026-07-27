import { memo } from "react";
import { Bell, BookOpen, CheckCircle2, FileText, HelpCircle, MessageCircle, Trophy, Zap } from "lucide-react";

import type { FeedItem, FeedItemKind } from "../../models/cohort";
import styles from "./FeedCard.module.css";

const iconByKind: Record<FeedItemKind, typeof BookOpen> = {
    lesson: BookOpen,
    quiz: HelpCircle,
    checkpoint: CheckCircle2,
    assignment: FileText,
    discussion: MessageCircle,
    resource: FileText,
    announcement: Bell,
    challenge: Zap,
    reflection: FileText,
    milestone: Trophy,
};

function FeedCardComponent({ item }: { item: FeedItem }) {
    const Icon = iconByKind[item.kind];

    return (
        <article className={styles.card} data-kind={item.kind}>
            <div className={styles.icon} aria-hidden="true">
                <Icon size={19} />
            </div>
            <div className={styles.body}>
                <div className={styles.top}>
                    <span>{item.eyebrow}</span>
                    <time>{item.timestamp}</time>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className={styles.footer}>
                    <strong>{item.meta}</strong>
                    {item.status && <em>{item.status}</em>}
                    <button type="button">{item.actionLabel}</button>
                </div>
            </div>
        </article>
    );
}

export const FeedCard = memo(FeedCardComponent);
