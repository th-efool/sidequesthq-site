import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

import styles from "./Header.module.css";

export function Header({ title }: { title: string }) {
    return (
        <header className={styles.header}>
            <Link className={styles.back} href="/home"><ArrowLeft size={16} /> My cohorts</Link>
            <div className={styles.context}><span>Mission Control</span><strong>{title}</strong></div>
            <Link className={styles.discussion} href="/message"><MessageCircle size={16} /> Community</Link>
        </header>
    );
}
