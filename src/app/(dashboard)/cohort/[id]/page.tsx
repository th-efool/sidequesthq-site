import { Cohort } from "@/src/client/components/screens/dashboard/cohort";

export default async function CohortPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <Cohort cohortId={id} />;
}
