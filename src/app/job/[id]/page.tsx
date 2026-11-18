
import JobDetailsPage from "@/features/job/components/JobDetailsPage";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function JobDetailsContent({ params }: PageProps) {
  const { id } = await params;

  return <JobDetailsPage jobId={id} />;
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="container-default py-12">
          Loading job details...
        </div>
      }
    >
      <JobDetailsContent params={params} />
    </Suspense>
  );
}