import type { CohortDetail, CohortDifficulty } from "../models/cohort";

const avatars = ["/mock/avatars/a.webp", "/mock/avatars/b.webp", "/mock/avatars/c.webp", "/mock/avatars/d.webp", "/mock/avatars/e.webp"];

function titleFromId(id: string) {
    return id.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function makeCohort(overrides: Partial<CohortDetail> & Pick<CohortDetail, "id" | "title" | "provider" | "thumbnail">): CohortDetail {
    const difficulty: CohortDifficulty = overrides.difficulty ?? "Intermediate";

    return {
        id: overrides.id,
        title: overrides.title,
        subtitle: overrides.subtitle ?? "A focused learning journey with short sessions, community checkpoints, and practical progress rituals.",
        provider: overrides.provider,
        thumbnail: overrides.thumbnail,
        difficulty,
        durationLabel: overrides.durationLabel ?? "4 weeks",
        progressPercent: overrides.progressPercent ?? 62,
        learnerCountLabel: overrides.learnerCountLabel ?? "8.4k learners",
        rating: overrides.rating ?? 4.8,
        creator: overrides.creator ?? { id: "mentor", name: overrides.provider, avatar: avatars[0], role: "Cohort lead" },
        tags: overrides.tags ?? ["Focus", "Practice", "Community"],
        progress: overrides.progress ?? {
            percent: overrides.progressPercent ?? 62,
            completedLessons: 15,
            totalLessons: 24,
            minutesToday: 14,
            dailyGoalMinutes: 20,
            streakDays: 8,
            consistency: [70, 100, 45, 80, 100, 60, 90],
            hoursCompleted: 6.5,
            hoursRemaining: 3.8,
            nextMilestone: "Finish Module 3",
            nextCheckpoint: "Friday focus review",
            currentLessonTitle: "Design your shutdown ritual",
            currentLessonDuration: "12 min left",
            estimatedCompletion: "Today, 8:40 PM",
            weeklyPaceLabel: "5 of 7 study days complete",
        },
        dailyGoalLabel: overrides.dailyGoalLabel ?? "20 min / day",
        discussionCountLabel: overrides.discussionCountLabel ?? "98 studying now",
        curriculum: overrides.curriculum ?? [
            {
                id: "foundation",
                title: "Module 1 · Build the operating system",
                summary: "Set your goal, define constraints, and create your first repeatable session.",
                progressPercent: 100,
                lessons: [
                    { id: "intent", title: "Write the cohort intent", description: "Define the outcome and why it matters this month.", durationLabel: "8 min", status: "complete", resources: 1 },
                    { id: "baseline", title: "Map your current routine", description: "Find the attention leaks that will compete with practice.", durationLabel: "11 min", status: "complete" },
                    { id: "first-session", title: "Run the first focused session", description: "Start small, measure honestly, and close the loop.", durationLabel: "14 min", status: "complete" },
                ],
            },
            {
                id: "practice-loop",
                title: "Module 2 · Practice loop",
                summary: "Turn learning into a daily loop of prep, action, reflection, and discussion.",
                progressPercent: 58,
                lessons: [
                    { id: "shutdown-ritual", title: "Design your shutdown ritual", description: "Protect the next session before today ends.", durationLabel: "12 min", status: "in-progress", resources: 2 },
                    { id: "friction-log", title: "Create a friction log", description: "Capture blockers without losing momentum.", durationLabel: "9 min", status: "available" },
                    { id: "peer-review", title: "Share one useful artifact", description: "Use the room to make your work visible.", durationLabel: "16 min", status: "available" },
                ],
            },
            {
                id: "checkpoint",
                title: "Module 3 · Checkpoint and refine",
                summary: "Compare your plan with reality and choose the next constraint to remove.",
                progressPercent: 0,
                locked: true,
                lessons: [
                    { id: "weekly-review", title: "Weekly review", description: "Convert activity into a better system.", durationLabel: "18 min", status: "locked" },
                    { id: "next-sprint", title: "Plan the next sprint", description: "Pick the next tiny bet for your learning path.", durationLabel: "13 min", status: "locked" },
                ],
            },
        ],
        feed: overrides.feed ?? [
            { id: "f1", kind: "lesson", eyebrow: "Resume", title: "Design your shutdown ritual", description: "Continue the lesson that closes your day and protects tomorrow's focus block.", timestamp: "Next action", actionLabel: "Resume lesson", meta: "12 min left", status: "in-progress" },
            { id: "f2", kind: "checkpoint", eyebrow: "Due Friday", title: "Focus sprint reflection", description: "Submit a short reflection on what helped you protect attention this week.", timestamp: "2 days left", actionLabel: "Open checkpoint", meta: "Required", status: "due" },
            { id: "f3", kind: "discussion", eyebrow: "Community", title: "What keeps interrupting your first block?", description: "34 learners shared interruption patterns and fixes that are working.", timestamp: "18 min ago", actionLabel: "Join thread", meta: "34 replies", status: "new" },
            { id: "f4", kind: "resource", eyebrow: "Resource", title: "Deep Work sprint template", description: "A lightweight planning board for your next three sessions.", timestamp: "Saved today", actionLabel: "Open template", meta: "Notion" },
            { id: "f5", kind: "challenge", eyebrow: "Challenge", title: "Two uninterrupted 25-minute blocks", description: "Try the challenge before the next checkpoint and compare notes with peers.", timestamp: "Starts tomorrow", actionLabel: "Accept", meta: "186 joined" },
        ],
        resources: overrides.resources ?? [
            { id: "r1", title: "Focus field guide", kind: "file", group: "Downloads", meta: "PDF · 8 pages", description: "The core rituals from the first two modules in one printable reference." },
            { id: "r2", title: "Sprint timer board", kind: "template", group: "Templates", meta: "Notion", description: "Track planned sessions, actual minutes, friction, and recovery notes." },
            { id: "r3", title: "Research reading list", kind: "article", group: "Links", meta: "6 links", description: "Short articles and papers behind the attention principles used in the cohort." },
            { id: "r4", title: "Reflection prompts", kind: "slides", group: "Cheat sheets", meta: "Slides", description: "Prompts for weekly review, peer discussion, and milestone planning." },
        ],
        discussions: overrides.discussions ?? [
            { id: "d1", title: "Most liked: How do you recover after breaking a focus block?", author: { id: "v", name: "Vanshika", avatar: avatars[1] }, latestActivity: "12 min ago", replyCount: 28, unreadCount: 6, likedCount: 94 },
            { id: "d2", title: "Share your shutdown ritual draft", author: { id: "r", name: "Rohan", avatar: avatars[2] }, latestActivity: "45 min ago", replyCount: 17, unreadCount: 3, likedCount: 51 },
            { id: "d3", title: "Accountability room for the morning sprint", author: { id: "a", name: "Aryan", avatar: avatars[3] }, latestActivity: "1h ago", replyCount: 42, unreadCount: 12, likedCount: 63 },
        ],
        friendsLearning: overrides.friendsLearning ?? [
            { id: "f1", name: "Shaqun", avatar: avatars[0], status: "Lesson 8" },
            { id: "f2", name: "Vanshika", avatar: avatars[1], status: "Checkpoint" },
            { id: "f3", name: "Rohan", avatar: avatars[2], status: "In focus" },
        ],
        checkpoints: overrides.checkpoints ?? [
            { id: "c1", title: "Focus sprint reflection", startsAt: "Fri · 7:00 PM", description: "Submit what changed after three protected sessions." },
            { id: "c2", title: "Peer teardown", startsAt: "Sun · 11:00 AM", description: "Review one learner's routine and suggest a smaller next step." },
        ],
        achievements: overrides.achievements ?? [
            { id: "a1", title: "8 day streak", description: "You have shown up every planned day this week." },
            { id: "a2", title: "Community helper", description: "3 replies were marked useful by peers." },
        ],
        recentNotes: overrides.recentNotes ?? ["Phone outside room worked better than app blockers.", "Shutdown ritual needs a calendar review step."],
        related: overrides.related ?? [
            { id: "productivity-systems", kind: "next", reason: "Build a broader personal workflow after focus habits land.", title: "Productivity Systems", provider: "SideQuestHQ", thumbnail: "/images/landing/coffee-break.webp", difficulty: "Intermediate", durationLabel: "3 weeks", progressPercent: 0, learnerCountLabel: "4.9k learners", rating: 4.7 },
            { id: "learning-how-to-learn", kind: "similar", reason: "Strengthen the meta-learning patterns behind deliberate practice.", title: "Learning How to Learn", provider: "Learning Lab", thumbnail: "/mock/thumbnails/reader.webp", difficulty: "Beginner", durationLabel: "2 weeks", progressPercent: 0, learnerCountLabel: "12k learners", rating: 4.9 },
            { id: "second-brain", kind: "prerequisite", reason: "Capture notes and decisions from each learning session.", title: "Second Brain Basics", provider: "Notion Academy", thumbnail: "/mock/thumbnails/content-bottle.webp", difficulty: "Beginner", durationLabel: "10 days", progressPercent: 0, learnerCountLabel: "7.1k learners", rating: 4.6 },
        ],
    };
}

export const cohortMock: Record<string, CohortDetail> = {
    "deep-work-mastery": makeCohort({ id: "deep-work-mastery", title: "Deep Work Mastery", provider: "Cal Newport", thumbnail: "/mock/thumbnails/deep-work-m.png" }),
    "deep-work": makeCohort({ id: "deep-work", title: "Deep Work", provider: "Cal Newport", thumbnail: "/mock/thumbnails/deep-work.webp", progressPercent: 68 }),
    "system-design": makeCohort({ id: "system-design", title: "System Design", provider: "ByteByteGo", thumbnail: "/mock/thumbnails/system-design.jpeg", difficulty: "Advanced", durationLabel: "6 weeks", progressPercent: 67, tags: ["Architecture", "Tradeoffs", "Interview prep"], subtitle: "Sketch, explain, and pressure-test distributed systems with peers before the next checkpoint.", dailyGoalLabel: "15 min / day" }),
    "system-design-bootcamp": makeCohort({ id: "system-design-bootcamp", title: "System Design Bootcamp", provider: "ByteByteGo", thumbnail: "/mock/thumbnails/system-design.jpeg", difficulty: "Advanced", progressPercent: 48 }),
    "history-psychology": makeCohort({ id: "history-psychology", title: "History of Psychology", provider: "CrashCourse", thumbnail: "/mock/thumbnails/history-psych.jpg", difficulty: "Beginner", progressPercent: 36, tags: ["History", "Psychology", "Concept maps"], dailyGoalLabel: "10 min / day" }),
    "german-language-a1": makeCohort({ id: "german-language-a1", title: "German Language A1", provider: "Learn German", thumbnail: "/mock/thumbnails/german.webp", difficulty: "Beginner", progressPercent: 24, tags: ["Language", "Daily practice", "Speaking"], dailyGoalLabel: "12 min / day" }),
};

export function getCohortMock(cohortId: string): CohortDetail {
    return cohortMock[cohortId] ?? makeCohort({ id: cohortId, title: titleFromId(cohortId), provider: "SideQuestHQ", thumbnail: "/mock/thumbnails/reading.webp" });
}
