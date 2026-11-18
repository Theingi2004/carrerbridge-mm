
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { applyForJob } from "../services/application.service";
import { isDemoMode } from "@/lib/demo-mode";
import { demoUser } from "@/features/auth/data/demo-user";

interface Props {
  jobId: string;
  userId: string;
}

export default function ApplyJobForm({ jobId, userId }: Props) {
  const router = useRouter();

  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Use demo user ID in Demo Mode
      const currentUserId = isDemoMode ? demoUser.id : userId;

      await applyForJob(currentUserId, {
        job_id: jobId,
        cover_letter: coverLetter.trim(),
      });

      setSuccess("Your application has been submitted successfully!");
      setCoverLetter("");
      router.push("/my-applications");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="coverLetter"
          className="mb-2 block text-sm font-semibold"
        >
          Cover Letter
        </label>

        <textarea
          id="coverLetter"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Introduce yourself and explain why you are suitable for this position..."
          rows={7}
          required
          className="w-full rounded-xl border border-border bg-background p-4 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />

        <p className="mt-2 text-xs text-muted-foreground">
          Explain your experience, skills, and interest in this position.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !coverLetter.trim()}
        className="w-full rounded-lg bg-brand-primary px-5 py-3 font-semibold text-white transition-all hover:bg-brand-primary/90 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
