
import PostJobForm from "@/features/job/components/PostJobForm";

export default function PostJobPage() {
  return (
    <main className="min-h-screen bg-brand-background py-12">
      <div className="container-default">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brand-text">
              Post a Job
            </h1>

            <p className="mt-2 text-muted-foreground">
              Create an IT job opportunity for job seekers.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <PostJobForm />
          </div>
        </div>
      </div>
    </main>
  );
}
