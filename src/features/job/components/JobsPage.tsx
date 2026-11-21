
"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  getCreatedJobs, getCachedJobs, getPublicJobs,

}
  from "../services/job.service";
import type { Job } from "../types/job.types";
import { jobs } from "../data/jobs";
import JobCard from "@/features/home/components/JobCard";
import { isDemoMode } from "@/lib/demo-mode";
export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [employmentType, setEmploymentType] = useState("all");
  const [createdJobs, setCreatedJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 9;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, employmentType]);

  useEffect(() => {
    const loadJobs = async () => {
      if (isDemoMode) {
        setCreatedJobs(getCreatedJobs());
        return;
      }

      // Show cached jobs immediately.
      setCreatedJobs(getCachedJobs());

      // Fetch the latest jobs from Supabase.
      try {
        const publicJobs = await getPublicJobs();
        const cachedJobs = getCachedJobs();

        // Merge database jobs and locally cached jobs.
        const mergedJobs = [
          ...cachedJobs,
          ...publicJobs.filter(
            (job) =>
              !cachedJobs.some(
                (cachedJob) => cachedJob.id === job.id
              )
          ),
        ];

        setCreatedJobs(mergedJobs);
      } catch (error) {
        console.error("Unable to fetch public jobs:", error);
      }
    };

    void loadJobs();
  }, []);
  const allJobs = [
    ...createdJobs.filter((job) => job.status === "active"),
    ...jobs,
  ];
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        job.title.toLowerCase().includes(searchText) ||
        job.company.toLowerCase().includes(searchText) ||
        job.tags.some((tag) =>
          tag.toLowerCase().includes(searchText)
        );

      const categoryMap: Record<string, string[]> = {
        frontend: ["frontend development", "frontend"],
        backend: ["backend development", "backend"],
        "full-stack": ["full stack development", "full stack"],
        "ui-ux": ["ui/ux design"],
        mobile: ["mobile development"],
        qa: ["quality assurance"],
        data: ["data analysis", "data & analytics"],
        devops: ["devops", "devops & cloud"],
        "it-support": ["it support"],
        wordpress: ["wordpress development", "wordpress"],
      };
      const matchesCategory =
        category === "all" ||
        (categoryMap[category] ?? []).includes(
          job.category.toLowerCase()
        );

      const matchesEmployment =
        employmentType === "all" ||
        job.employmentType === employmentType;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesEmployment
      );
    });
  }, [search, category, employmentType, createdJobs]);
  // Calculate total pages
  const totalPages = Math.ceil(
    filteredJobs.length / jobsPerPage
  );

  // Calculate the starting and ending index
  const startIndex = (currentPage - 1) * jobsPerPage;

  // Get jobs for the current page
  const currentJobs = filteredJobs.slice(
    startIndex,
    startIndex + jobsPerPage
  );

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setEmploymentType("all");
  };

  return (
    <main className="flex-1 bg-brand-background">
      {/* Page Header */}
      <section className="border-b border-border bg-white py-14 sm:py-16">
        <div className="container-default">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-secondary">
            Find Your Opportunity
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
            Explore IT Jobs in Myanmar
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Discover jobs and internships that match your
            skills and career goals.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-10">
        <div className="container-default">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal
                size={18}
                className="text-brand-primary"
              />
              <h2 className="font-semibold text-brand-text">
                Search and Filter Jobs
              </h2>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Search */}
              <div className="relative md:col-span-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search title, company, or skill..."
                  aria-label="Search jobs"
                  className="h-12 w-full rounded-lg border border-border bg-white pl-11 pr-4 text-sm outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                />
              </div>

              {/* Category */}
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                aria-label="Filter by category"
                className="h-12 rounded-lg border border-border bg-white px-4 text-sm text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
              >
                <option value="all">All Categories</option>
                <option value="frontend">Frontend Development</option>
                <option value="backend">Backend Development</option>
                <option value="full-stack">Full Stack Development</option>
                <option value="ui-ux">UI/UX Design</option>
                <option value="mobile">Mobile Development</option>
                <option value="qa">Quality Assurance</option>
                <option value="data">Data Analysis</option>
                <option value="devops">DevOps</option>
                <option value="it-support">IT Support</option>
                <option value="wordpress">WordPress Development</option>
              </select>

              {/* Employment Type */}
              <select
                value={employmentType}
                onChange={(event) =>
                  setEmploymentType(event.target.value)
                }
                aria-label="Filter by employment type"
                className="h-12 rounded-lg border border-border bg-white px-4 text-sm text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
              >
                <option value="all">All Employment Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-brand-primary transition-colors hover:text-brand-secondary active:scale-95"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="mt-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-brand-text">
                  Available Opportunities
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Showing{" "}
                  {filteredJobs.length === 0 ? 0 : startIndex + 1}
                  –
                  {Math.min(startIndex + jobsPerPage, filteredJobs.length)}
                  {" "}of {filteredJobs.length} jobs
                </p>
              </div>
            </div>

            {filteredJobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {currentJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                {/* Pagination */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-brand-text transition-colors hover:bg-brand-background disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`size-10 rounded-lg text-sm font-semibold transition-colors ${currentPage === page
                          ? "bg-brand-primary text-white"
                          : "border border-border text-brand-text hover:bg-brand-background"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-brand-text transition-colors hover:bg-brand-background disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </>

            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
                <Search
                  size={32}
                  className="mx-auto text-muted-foreground"
                />

                <h3 className="mt-4 text-lg font-bold text-brand-text">
                  No jobs found
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Try another keyword or change your filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-primary/90 active:scale-95"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
