
import type { Application } from "../types/application.types";
import ApplicationCard from "./ApplicationCard";

interface Props {
  applications: Application[];
}

export default function MyApplications({
  applications,
}: Props) {
  if (applications.length === 0) {
    return (
      <section className="py-16 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          No applications yet
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          You haven't applied for any jobs yet.
          Start exploring opportunities today.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          My Applications
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Track your job application status.
        </p>
      </div>

      <div className="grid gap-4">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
          />
        ))}
      </div>
    </section>
  );
}