interface PageSkeletonProps {
  variant?: "default" | "home" | "form" | "list" | "dashboard";
}

function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-[#b8c5bc] ${className}`}
    />
  );
}

export default function PageSkeleton({
  variant = "default",
}: PageSkeletonProps) {
  if (variant === "home") {
    return (
      <div aria-busy="true" aria-label="Loading home page" className="min-h-screen">
        <section className="bg-brand-background py-20 sm:py-28">
          <div className="container-default flex flex-col items-center">
            <SkeletonBlock className="h-9 w-52 rounded-full" />
            <SkeletonBlock className="mt-6 h-14 w-full max-w-3xl" />
            <SkeletonBlock className="mt-4 h-14 w-4/5 max-w-2xl" />
            <SkeletonBlock className="mt-6 h-6 w-full max-w-xl" />
            <SkeletonBlock className="mt-10 h-20 w-full max-w-2xl rounded-2xl" />
          </div>
        </section>
        {[0, 1].map((section) => (
          <section
            key={section}
            className={`py-20 ${section === 1 ? "bg-brand-background" : "bg-white"}`}
          >
            <div className="container-default">
              <SkeletonBlock className="h-4 w-36" />
              <SkeletonBlock className="mt-3 h-10 w-64 max-w-full" />
              <SkeletonBlock className="mt-3 h-5 w-full max-w-xl" />
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-64 rounded-2xl border border-border bg-white p-6"
                  >
                    <SkeletonBlock className="size-12 rounded-xl" />
                    <SkeletonBlock className="mt-5 h-6 w-3/4" />
                    <SkeletonBlock className="mt-3 h-4 w-1/2" />
                    <SkeletonBlock className="mt-6 h-20 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  }

  if (variant === "form") {
    return (
      <main aria-busy="true" aria-label="Loading form" className="min-h-[70vh] bg-brand-background py-12">
        <div className="container-default">
          <div className="mx-auto max-w-2xl">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="mt-3 h-10 w-64 max-w-full" />
            <SkeletonBlock className="mt-3 h-5 w-80 max-w-full" />
            <div className="mt-8 rounded-2xl border border-border bg-white p-6 sm:p-8">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <SkeletonBlock className="h-4 w-28" />
                  <SkeletonBlock className="mt-2 h-12 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (variant === "dashboard") {
    return (
      <main aria-busy="true" aria-label="Loading dashboard" className="min-h-screen bg-brand-background py-12">
        <div className="container-default">
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="mt-3 h-10 w-72 max-w-full" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="h-36 rounded-2xl border border-border bg-white p-6">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="mt-4 h-8 w-32" />
              </div>
            ))}
          </div>
          <div className="mt-6 h-80 rounded-2xl border border-border bg-white p-6">
            <SkeletonBlock className="h-6 w-48" />
            {[0, 1, 2].map((index) => (
              <SkeletonBlock key={index} className="mt-3 h-12 w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (variant === "list") {
    return (
      <main aria-busy="true" aria-label="Loading list" className="min-h-screen bg-brand-background py-12">
        <div className="container-default">
          <SkeletonBlock className="h-10 w-52 max-w-full" />
          <SkeletonBlock className="mt-3 h-5 w-80 max-w-full" />
          <div className="mt-8 grid gap-5 lg:grid-cols-[280px_1fr]">
            <div className="hidden h-96 rounded-2xl border border-border bg-white p-5 lg:block">
              <SkeletonBlock className="h-5 w-32" />
              {[0, 1, 2, 3].map((index) => (
                <SkeletonBlock key={index} className="mt-6 h-10 w-full" />
              ))}
            </div>
            <div className="grid gap-5">
              {[0, 1, 2].map((index) => (
                <div key={index} className="h-52 rounded-2xl border border-border bg-white p-6">
                  <SkeletonBlock className="size-12 rounded-xl" />
                  <SkeletonBlock className="mt-5 h-6 w-1/2" />
                  <SkeletonBlock className="mt-3 h-4 w-1/3" />
                  <SkeletonBlock className="mt-6 h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main aria-busy="true" aria-label="Loading page" className="container-default min-h-[70vh] py-12">
      <SkeletonBlock className="h-4 w-32" />
      <SkeletonBlock className="mt-3 h-10 w-72 max-w-full" />
      <SkeletonBlock className="mt-3 h-5 w-96 max-w-full" />
      <div className="mt-8 h-96 rounded-2xl border border-border bg-white p-6">
        <SkeletonBlock className="h-6 w-48" />
        {[0, 1, 2].map((index) => (
          <SkeletonBlock key={index} className="mt-3 h-12 w-full" />
        ))}
      </div>
    </main>
  );
}
