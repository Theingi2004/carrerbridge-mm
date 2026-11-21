
"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  JobAlert,
  CreateJobAlertInput,
} from "../types/job-alert.types";

import {
  getJobAlerts,
  createJobAlert,
  updateJobAlert,
  deleteJobAlert,
} from "../services/job-alert.service";

export default function useJobAlerts() {
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJobAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getJobAlerts();

      setJobAlerts(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load job alerts."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobAlerts();
  }, [loadJobAlerts]);

  const addJobAlert = async (input: CreateJobAlertInput) => {
    try {
      setError("");

      const newAlert = await createJobAlert(input);

      setJobAlerts((previous) => [newAlert, ...previous]);

      return newAlert;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create job alert.";

      setError(message);
      throw error;
    }
  };

  const editJobAlert = async (
    alertId: string,
    input: Partial<CreateJobAlertInput> & { is_active?: boolean }
  ) => {
    try {
      setError("");

      const updatedAlert = await updateJobAlert(alertId, input);

      setJobAlerts((previous) =>
        previous.map((alert) =>
          alert.id === alertId ? updatedAlert : alert
        )
      );

      return updatedAlert;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update job alert.";

      setError(message);
      throw error;
    }
  };

  const removeJobAlert = async (alertId: string) => {
    try {
      setError("");

      await deleteJobAlert(alertId);

      setJobAlerts((previous) =>
        previous.filter((alert) => alert.id !== alertId)
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete job alert.";

      setError(message);
      throw error;
    }
  };

  return {
    jobAlerts,
    isLoading,
    error,
    loadJobAlerts,
    addJobAlert,
    editJobAlert,
    removeJobAlert,
  };
}
