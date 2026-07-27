"use client";

import { useMemo } from "react";

import { getCohortMock } from "../mock/cohort";

export function useCohort(cohortId: string) {
    return useMemo(() => getCohortMock(cohortId), [cohortId]);
}
