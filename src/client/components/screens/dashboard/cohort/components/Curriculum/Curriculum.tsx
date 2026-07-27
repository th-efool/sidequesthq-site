import { CheckCircle2, ChevronDown, Lock, PlayCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { CurriculumModule, LessonStatus } from "../../models/cohort";
import styles from "./Curriculum.module.css";

const storageKey = "sidequest-cohort-open-modules";

function LessonIcon({ status }: { status: LessonStatus }) {
    if (status === "complete") return <CheckCircle2 size={17} />;
    if (status === "locked") return <Lock size={17} />;
    return <PlayCircle size={17} />;
}

function readOpenModules(modules: CurriculumModule[]) {
    const fallback = modules.filter((module) => !module.locked).map((module) => module.id);

    if (typeof window === "undefined") return new Set(fallback);

    try {
        const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as string[];
        return new Set(stored.length > 0 ? stored : fallback);
    } catch {
        return new Set(fallback);
    }
}

export function Curriculum({ modules }: { modules: CurriculumModule[] }) {
    const currentLessonRef = useRef<HTMLDivElement | null>(null);
    const [openModules, setOpenModules] = useState(() => readOpenModules(modules));
    const currentModuleId = useMemo(() => modules.find((module) => module.lessons.some((lesson) => lesson.status === "in-progress"))?.id, [modules]);

    useEffect(() => {
        window.localStorage.setItem(storageKey, JSON.stringify(Array.from(openModules)));
    }, [openModules]);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            currentLessonRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }, 250);

        return () => window.clearTimeout(timeout);
    }, []);

    const toggleModule = useCallback((moduleId: string) => {
        setOpenModules((current) => {
            const next = new Set(current);
            if (next.has(moduleId)) {
                next.delete(moduleId);
            } else {
                next.add(moduleId);
            }
            return next;
        });
    }, []);

    return (
        <section className={styles.section} id="curriculum">
            <div className={styles.header}>
                <span>Curriculum</span>
                <h2>Modules and lessons</h2>
                <p>Expandable learning path with locked, current, and completed lessons.</p>
            </div>

            <div className={styles.modules}>
                {modules.map((module) => {
                    const isOpen = openModules.has(module.id);
                    const isCurrent = module.id === currentModuleId;

                    return (
                        <article className={`${styles.module} ${isCurrent ? styles.currentModule : ""}`} key={module.id}>
                            <button
                                type="button"
                                className={styles.moduleHeader}
                                onClick={() => toggleModule(module.id)}
                                aria-expanded={isOpen}
                            >
                                <div>
                                    <h3>{module.title}</h3>
                                    <p>{module.summary}</p>
                                </div>
                                <div className={styles.moduleProgress} aria-label={`${module.progressPercent}% complete`}>
                                    <span style={{ width: `${module.progressPercent}%` }} />
                                </div>
                                <strong>{module.progressPercent}%</strong>
                                <ChevronDown className={isOpen ? styles.chevronOpen : ""} size={18} />
                            </button>

                            <div className={`${styles.lessons} ${isOpen ? styles.lessonsOpen : ""}`}>
                                <div>
                                    {module.lessons.map((lesson) => {
                                        const statusClass = lesson.status === "in-progress" ? styles.inProgress : styles[lesson.status] ?? "";

                                        return (
                                            <div
                                                className={`${styles.lesson} ${statusClass}`}
                                                key={lesson.id}
                                                ref={lesson.status === "in-progress" ? currentLessonRef : undefined}
                                            >
                                                <LessonIcon status={lesson.status} />
                                                <div>
                                                    <strong>{lesson.title}</strong>
                                                    <p>{lesson.description}</p>
                                                </div>
                                                <span>{lesson.durationLabel}</span>
                                                {Boolean(lesson.resources) && <em>{lesson.resources} resources</em>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
