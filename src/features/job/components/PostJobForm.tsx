
"use client";

import type { Job } from "../types/job.types";
import { demoRecruiterJobs } from "../data/demo-recruiter-jobs";

import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/client";
import { addToSyncQueue } from "@/lib/offline-sync";
import { useEffect, useState } from "react";
import { createJob, getJobById, updateJob } from "../services/job.service";
import { demoRecruiter } from "@/features/auth/data/demo-user";
import { useRouter } from "next/navigation";
import { ThemeSelect } from "@/components/ui/theme-select";
import { MYANMAR_LOCATIONS } from "../constants/job-locations";

const STORAGE_KEY = "careerbridge-demo-jobs";

interface PostJobFormProps {
  jobId?: string;
}

const IT_JOB_CATEGORIES: string[] = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile Development",
  "UI/UX Design",
  "Quality Assurance",
  "Data Analysis",
  "DevOps",
  "IT Support",
  "WordPress Development",
];

export default function PostJobForm({ jobId }: PostJobFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    employmentType: "Full-time",
    experienceLevel: "Entry Level",
    salary: "",
    category: "",
    tags: "",
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(jobId));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    const existingJob = getJobById(jobId);

    if (!existingJob) {
      setError("Job not found.");
      setIsLoading(false);
      return;
    }

    if (existingJob.recruiterId !== demoRecruiter.id) {
      setError("You are not authorized to edit this job.");
      setIsLoading(false);
      return;
    }

    setFormData({
      title: existingJob.title,
      company: existingJob.company,
      location: existingJob.location,
      employmentType: existingJob.employmentType,
      experienceLevel: existingJob.experienceLevel,
      salary: existingJob.salary,
      category: existingJob.category,
      tags: existingJob.tags.join(", "),
      description: existingJob.description,
      responsibilities: existingJob.responsibilities.join("\n"),
      requirements: existingJob.requirements.join("\n"),
      benefits: existingJob.benefits.join("\n"),
    });

    setIsLoading(false);
  }, [jobId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    if (isSubmitting) return;

    // Get the existing job when editing.
    const existingJob = jobId ? getJobById(jobId) : undefined;

    // Check job ownership.
    if (
      jobId &&
      (!existingJob || existingJob.recruiterId !== demoRecruiter.id)
    ) {
      setError(
        !existingJob
          ? "Job not found."
          : "You are not authorized to edit this job."
      );
      return;
    }

    const postedAt = existingJob?.postedAt ?? new Date().toISOString();

    const expiresAt =
      existingJob?.expiresAt ??
      new Date(
        new Date(postedAt).getTime() + 30 * 24 * 60 * 60 * 1000
      ).toISOString();

    const jobData: Job = {
      id: jobId ?? crypto.randomUUID(),
      recruiterId: demoRecruiter.id,
      title: formData.title.trim(),
      status: existingJob?.status ?? "active",
      company: formData.company.trim(),
      location: formData.location.trim(),
      employmentType: formData.employmentType,
      experienceLevel: formData.experienceLevel,
      salary: formData.salary.trim(),
      postedAt,
      expiresAt,
      category: formData.category,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      description: formData.description.trim(),
      responsibilities: formData.responsibilities
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      requirements: formData.requirements
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      benefits: formData.benefits
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    // Validate required fields.
    if (
      !jobData.title ||
      !jobData.company ||
      !jobData.description ||
      !jobData.category
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!IT_JOB_CATEGORIES.includes(jobData.category)) {
      setError("Please select a valid IT job category.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (jobId) {
        // Existing Demo Mode edit behavior.
        updateJob(jobData, demoRecruiter.id);
      } else {
        // Create job using Demo Mode or Supabase service.
        await createJob(jobData);
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand-primary";

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading job...
      </p>
    );
  }

  if (jobId && error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5">
        <p className="font-medium text-red-700">{error}</p>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-4 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium">
          Job Title *
        </label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className={inputClass}
          placeholder="e.g. Junior Frontend Developer"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Company Name *
        </label>
        <input
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          className={inputClass}
          placeholder="Company name"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Location
        </label>

        <ThemeSelect
          name="location"
          value={formData.location}
          onValueChange={(value) =>
            setFormData((current) => ({
              ...current,
              location: value,
            }))
          }
          placeholder="Select location"
          options={[
            { value: "", label: "Select location" },
            ...MYANMAR_LOCATIONS.map((location) => ({
              value: location,
              label: location,
            })),
            { value: "Remote", label: "Remote" },
          ]}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Employment Type
          </label>
          <ThemeSelect
            name="employmentType"
            value={formData.employmentType}
            onValueChange={(value) =>
              setFormData((current) => ({
                ...current,
                employmentType: value,
              }))
            }
            options={[
              { value: "Full-time", label: "Full-time" },
              { value: "Part-time", label: "Part-time" },
              { value: "Internship", label: "Internship" },
              { value: "Contract", label: "Contract" },
              { value: "Remote", label: "Remote" },
            ]}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Experience Level
          </label>
          <ThemeSelect
            name="experienceLevel"
            value={formData.experienceLevel}
            onValueChange={(value) =>
              setFormData((current) => ({
                ...current,
                experienceLevel: value,
              }))
            }
            options={[
              { value: "Entry Level", label: "Entry Level" },
              { value: "Junior", label: "Junior" },
              { value: "Mid Level", label: "Mid Level" },
              { value: "Senior", label: "Senior" },
            ]}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Salary
        </label>
        <input
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className={inputClass}
          placeholder="e.g. Negotiable"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          IT Job Category *
        </label>
        <ThemeSelect
          name="category"
          value={formData.category}
          onValueChange={(value) =>
            setFormData((current) => ({
              ...current,
              category: value,
            }))
          }
          required
          placeholder="Select category"
          options={IT_JOB_CATEGORIES.map((category) => ({
            value: category,
            label: category,
          }))}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Tags (comma separated)
        </label>
        <input
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className={inputClass}
          placeholder="React, TypeScript, Next.js"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Job Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          className={inputClass}
        />
      </div>

      {(["responsibilities", "requirements", "benefits"] as const).map(
        (field) => (
          <div key={field}>
            <label className="mb-2 block text-sm font-medium capitalize">
              {field} (one item per line)
            </label>
            <textarea
              name={field}
              value={formData[field]}
              onChange={handleChange}
              rows={4}
              className={inputClass}
              placeholder="Enter one item per line"
            />
          </div>
        )
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-brand-primary px-5 py-3 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? "Saving..."
          : jobId
            ? "Update Job"
            : "Post Job"}
      </button>
    </form>
  );
}