
"use client";

import { getSavedJobs, saveJob, unsaveJob } from "@/features/profile/services/saved-job.service";
import { useCallback, useEffect, useState } from "react";


export default function useSavedJobs() {
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSavedJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getSavedJobs();

      setSavedJobIds(data.map((savedJob) => savedJob.job_id));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load saved jobs."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);

  const toggleSavedJob = async (jobId: string) => {
    try {
      setError("");

      const isSaved = savedJobIds.includes(jobId);

      if (isSaved) {
        await unsaveJob(jobId);

        setSavedJobIds((previous) =>
          previous.filter((id) => id !== jobId)
        );
      } else {
        await saveJob(jobId);

        setSavedJobIds((previous) =>
          previous.includes(jobId)
            ? previous
            : [...previous, jobId]
        );
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update saved job."
      );
    }
  };

  return {
    savedJobIds,
    isLoading,
    error,
    toggleSavedJob,
    loadSavedJobs,
  };
}
