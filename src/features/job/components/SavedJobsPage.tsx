"use client";

import { useEffect, useMemo, useState } from "react";
import { Bookmark, Search } from "lucide-react";

import useSavedJobs from "../hooks/useSavedJobs";
import JobCard from "@/features/home/components/JobCard";

import {
  getCreatedJobs,
  getCachedJobs,
  getPublicJobs,
} from "../services/job.service";

import { jobs } from "../data/jobs";
import type { Job } from "../types/job.types";
import { isDemoMode } from "@/lib/demo-mode";

export default function SavedJobsPage() {
  const {
    savedJobIds,
    toggleSavedJob,
    isLoading: isSavedJobsLoading,
  } = useSavedJobs();

  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [isJobsLoading, setIsJobsLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        if (isDemoMode) {
          setAvailableJobs([...getCreatedJobs(), ...jobs]);
          return;
        }

        const cachedJobs = getCachedJobs();
        setAvailableJobs([...cachedJobs, ...jobs]);

        const publicJobs = await getPublicJobs();

        const mergedJobs = [
          ...cachedJobs,
          ...publicJobs.filter(
            (job) =>
              !cachedJobs.some(
                (cachedJob) => cachedJob.id === job.id
              )
          ),
          ...jobs,
        ];

        setAvailableJobs(mergedJobs);
      } catch (error) {
        console.error("Unable to load saved jobs:", error);
      } finally {
        setIsJobsLoading(false);
      }
    };

    void loadJobs();
  }, []);

  const savedJobs = useMemo(() => {
    return availableJobs.filter((job) =>
      savedJobIds.includes(job.id)
    );
  }, [availableJobs, savedJobIds]);

  const isLoading = isSavedJobsLoading || isJobsLoading;

  return (
    <main className="min-h-screen flex-1 bg-brand-background py-12">
      <div className="container-default">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Bookmark className="text-brand-primary" size={26} />

            <h1 className="text-2xl font-bold text-brand-text">
              Saved Jobs
            </h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Keep track of the job opportunities you are interested in.
          </p>
        </div>

        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Loading saved jobs...
          </p>
        ) : savedJobs.length > 0 ? (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              You have saved {savedJobs.length} job
              {savedJobs.length !== 1 ? "s" : ""}.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {savedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={true}
                  onToggleSave={toggleSavedJob}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
            <Search
              size={32}
              className="mx-auto text-muted-foreground"
            />

            <h2 className="mt-4 text-lg font-bold text-brand-text">
              No saved jobs yet
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Browse available jobs and bookmark the ones you like.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}