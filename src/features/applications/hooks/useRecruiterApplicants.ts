
"use client";

import { useEffect, useState } from "react";

import { getRecruiterApplicants } from "../services/application.service";
import { demoRecruiter } from "@/features/auth/data/demo-user";
import { Applicant } from "../types/application.types";


export default function useRecruiterApplicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplicants = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getRecruiterApplicants(demoRecruiter.id);

        setApplicants(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load applicants."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadApplicants();
  }, []);

  return {
    applicants,
    isLoading,
    error,
    setApplicants,
  };
}