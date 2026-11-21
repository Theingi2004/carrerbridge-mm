
"use client";

import { useEffect, useState } from "react";

import {
  getCreatedJobs,
  initializeDemoRecruiterJobs,
  closeJob,
  reopenJob,
  extendJob,
  deleteJob,
} from "../services/job.service";

import { demoRecruiter } from "@/features/auth/data/demo-user";
import type { Job } from "../types/job.types";

export default function useMyJobs() {
  const [myJobs, setMyJobs] = useState<Job[]>([]);

  // Confirmation Dialog State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(
    null
  );
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  // Load Recruiter Jobs
  useEffect(() => {
    initializeDemoRecruiterJobs();

    const allJobs = getCreatedJobs();

    const recruiterJobs = allJobs.filter(
      (job) => job.recruiterId === demoRecruiter.id
    );

    setMyJobs(recruiterJobs);
  }, []);

  // Open Confirmation Dialog
  const requestConfirmation = (
    action: () => void,
    title: string,
    message: string
  ) => {
    setConfirmAction(() => action);
    setConfirmTitle(title);
    setConfirmMessage(message);
    setIsConfirmOpen(true);
  };

  // Confirm Action
  const handleConfirm = () => {
    try {
      confirmAction?.();
    } finally {
      setIsConfirmOpen(false);
      setConfirmAction(null);
    }
  };

  // Cancel Action
  const handleCancel = () => {
    setIsConfirmOpen(false);
    setConfirmAction(null);
  };

  // Close Job
  const handleCloseJob = (jobId: string) => {
    requestConfirmation(
      () => {
        closeJob(jobId, demoRecruiter.id);

        setMyJobs((previousJobs) =>
          previousJobs.map((job) =>
            job.id === jobId ? { ...job, status: "closed" } : job
          )
        );
      },
      "Close this job?",
      "Are you sure you want to close this job? Job seekers will no longer be able to apply."
    );
  };

  // Reopen Job
  const handleReopenJob = (jobId: string) => {
    requestConfirmation(
      () => {
        reopenJob(jobId, demoRecruiter.id);

        setMyJobs((previousJobs) =>
          previousJobs.map((job) =>
            job.id === jobId ? { ...job, status: "active" } : job
          )
        );
      },
      "Reopen this job?",
      "Are you sure you want to reopen this job? Job seekers will be able to apply again."
    );
  };

  // Extend Job
  const handleExtendJob = (jobId: string) => {
    requestConfirmation(
      () => {
        extendJob(jobId, demoRecruiter.id);

        const updatedJobs = getCreatedJobs();

        setMyJobs(
          updatedJobs.filter(
            (job) => job.recruiterId === demoRecruiter.id
          )
        );
      },
      "Extend this job?",
      "Are you sure you want to extend this job for another 30 days?"
    );
  };

  // Delete Job
  const handleDeleteJob = (jobId: string) => {
    requestConfirmation(
      () => {
        deleteJob(jobId, demoRecruiter.id);

        setMyJobs((previousJobs) =>
          previousJobs.filter((job) => job.id !== jobId)
        );
      },
      "Delete this job?",
      "Are you sure you want to delete this job? This action cannot be undone."
    );
  };

  return {
    myJobs,
    isConfirmOpen,
    confirmTitle,
    confirmMessage,
    handleCloseJob,
    handleReopenJob,
    handleExtendJob,
    handleDeleteJob,
    handleConfirm,
    handleCancel,
  };
}