"use client";

import { Header } from "./components/Header/Header";
import { Hero } from "./components/Hero/Hero";
import { Progress } from "./components/Progress/Progress";
import { Feed } from "./components/Feed/Feed";
import { Curriculum } from "./components/Curriculum/Curriculum";
import { Resources } from "./components/Resources/Resources";
import { Discussions } from "./components/Discussions/Discussions";
import { Insights } from "./components/Insights/Insights";
import { Related } from "./components/Related/Related";
import { ContinueLearning } from "./components/ContinueLearning/ContinueLearning";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { useCohort } from "./hooks/useCohort";

import styles from "./Cohort.module.css";

export function Cohort({ cohortId }: { cohortId: string }) {
    const cohort = useCohort(cohortId);

    return (
        <main className={styles.cohort}>
            <Header title={cohort.title} />
            <Hero cohort={cohort} />
            <div className={styles.layout}>
                <div className={styles.mainColumn}>
                    <ContinueLearning progress={cohort.progress} />
                    <Progress progress={cohort.progress} />
                    <Feed items={cohort.feed} />
                    <Curriculum modules={cohort.curriculum} />
                    <Resources resources={cohort.resources} />
                    <Discussions discussions={cohort.discussions} />
                    <Insights progress={cohort.progress} />
                    <Related cohorts={cohort.related} />
                </div>
                <Sidebar cohort={cohort} />
            </div>
        </main>
    );
}
