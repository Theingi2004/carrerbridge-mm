
export default function Home() {
  return (
    <main className="min-h-screen bg-background p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <h1 className="text-4xl font-bold text-brand-primary">
          CareerBridge MM
        </h1>

        <p className="text-muted-foreground">
          Your career journey starts here.
        </p>

        <div className="flex flex-wrap gap-4">
          <button className="rounded-lg bg-primary px-6 py-3 text-white">
            Get Started
          </button>

          <button className="rounded-lg bg-brand-secondary px-6 py-3 text-brand-text">
            Explore Jobs
          </button>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Find Your Next Opportunity
          </h2>
          <p className="mt-2 text-muted-foreground">
            Discover opportunities that match your skills.
          </p>
        </div>
      </div>
    </main>
  );
}
