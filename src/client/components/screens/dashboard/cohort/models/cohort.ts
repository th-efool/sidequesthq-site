export type CohortDifficulty = "Beginner" | "Intermediate" | "Advanced";
export type LessonStatus = "locked" | "available" | "in-progress" | "complete";
export type ResourceKind = "article" | "video" | "file" | "link" | "repository" | "template" | "slides";
export type FeedItemKind = "lesson" | "quiz" | "checkpoint" | "assignment" | "discussion" | "resource" | "announcement" | "challenge" | "reflection" | "milestone";
export type RecommendationKind = "next" | "similar" | "prerequisite";

export interface Creator {
    id: string;
    name: string;
    avatar: string;
    role: string;
}

export interface LearnerPreview {
    id: string;
    name: string;
    avatar: string;
    status?: string;
}

export interface CohortSummary {
    id: string;
    title: string;
    provider: string;
    thumbnail: string;
    difficulty: CohortDifficulty;
    durationLabel: string;
    progressPercent: number;
    learnerCountLabel?: string;
    rating?: number;
}

export interface ProgressSummary {
    percent: number;
    completedLessons: number;
    totalLessons: number;
    minutesToday: number;
    dailyGoalMinutes: number;
    streakDays: number;
    consistency: number[];
    hoursCompleted: number;
    hoursRemaining: number;
    nextMilestone: string;
    nextCheckpoint: string;
    currentLessonTitle: string;
    currentLessonDuration: string;
    estimatedCompletion: string;
    weeklyPaceLabel: string;
}

export interface CurriculumLesson {
    id: string;
    title: string;
    description: string;
    durationLabel: string;
    status: LessonStatus;
    resources?: number;
}

export interface CurriculumModule {
    id: string;
    title: string;
    summary: string;
    progressPercent: number;
    locked?: boolean;
    lessons: CurriculumLesson[];
}

export interface Resource {
    id: string;
    title: string;
    kind: ResourceKind;
    group: string;
    meta: string;
    description: string;
}

export interface DiscussionPreview {
    id: string;
    title: string;
    author: LearnerPreview;
    latestActivity: string;
    replyCount: number;
    unreadCount: number;
    likedCount: number;
}

export interface FeedItem {
    id: string;
    kind: FeedItemKind;
    title: string;
    description: string;
    eyebrow: string;
    timestamp: string;
    actionLabel: string;
    meta: string;
    status?: LessonStatus | "new" | "due";
}

export interface Checkpoint {
    id: string;
    title: string;
    startsAt: string;
    description: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
}

export interface Recommendation extends CohortSummary {
    kind: RecommendationKind;
    reason: string;
}

export interface CohortDetail extends CohortSummary {
    subtitle: string;
    creator: Creator;
    tags: string[];
    progress: ProgressSummary;
    dailyGoalLabel: string;
    discussionCountLabel: string;
    curriculum: CurriculumModule[];
    feed: FeedItem[];
    resources: Resource[];
    discussions: DiscussionPreview[];
    friendsLearning: LearnerPreview[];
    checkpoints: Checkpoint[];
    achievements: Achievement[];
    recentNotes: string[];
    related: Recommendation[];
}
