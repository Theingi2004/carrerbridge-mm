import JobDetailsPage from "@/features/jobs/components/JobDetailsPage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <JobDetailsPage jobId={id} />;
}