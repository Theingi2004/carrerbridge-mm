
import ApplicationStatus from "@/features/applications/components/ApplicationStatus";

export default function TestApplicationPage() {
  return (
    <main className="container-default space-y-4 py-10">
      <h1 className="text-2xl font-bold">
        Application Status Test
      </h1>

      <div className="flex flex-wrap gap-3">
        <ApplicationStatus status="pending" />
        <ApplicationStatus status="reviewing" />
        <ApplicationStatus status="shortlisted" />
        <ApplicationStatus status="rejected" />
        <ApplicationStatus status="accepted" />
      </div>
    </main>
  );
}