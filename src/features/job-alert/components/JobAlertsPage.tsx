
"use client";

import { useState } from "react";
import {
  BellRing,
  Plus,
  Trash2,
  MapPin,
  BriefcaseBusiness,
} from "lucide-react";

import useJobAlerts from "../hooks/useJobAlerts";
import type { CreateJobAlertInput } from "../types/job-alert.types";

export default function JobAlertsPage() {
  const {
    jobAlerts,
    isLoading,
    error,
    addJobAlert,
    editJobAlert,
    removeJobAlert,
  } = useJobAlerts();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) return;

    const input: CreateJobAlertInput = {
      name: name.trim(),
      category: category.trim(),
      location: location.trim(),
      employment_type: employmentType,
      experience_level: experienceLevel,
    };

    try {
      setIsSubmitting(true);
      setActionError("");

      await addJobAlert(input);

      setName("");
      setCategory("");
      setLocation("");
      setEmploymentType("");
      setExperienceLevel("");
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to create job alert."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (
    alertId: string,
    isActive: boolean
  ) => {
    try {
      setActionError("");
      await editJobAlert(alertId, { is_active: !isActive });
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to update job alert."
      );
    }
  };

  const handleDelete = async (alertId: string) => {
    try {
      setActionError("");
      await removeJobAlert(alertId);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to delete job alert."
      );
    }
  };

  return (
    <main className="min-h-screen flex-1 bg-brand-background py-12">
      <div className="container-default">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <BellRing className="text-brand-primary" size={26} />

            <h1 className="text-2xl font-bold text-brand-text">
              Job Alerts
            </h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Create job alerts to keep track of opportunities that match
            your interests.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
          <section className="h-fit rounded-2xl border border-border bg-white p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-brand-text">
              <Plus size={20} />
              Create New Alert
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-text">
                  Alert Name *
                </label>

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. React Developer Jobs"
                  required
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-text">
                  Category
                </label>

                <input
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  placeholder="e.g. Frontend Development"
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-text">
                  Location
                </label>

                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="e.g. Yangon"
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-text">
                  Employment Type
                </label>

                <select
                  value={employmentType}
                  onChange={(event) =>
                    setEmploymentType(event.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-primary"
                >
                  <option value="">Any Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-text">
                  Experience Level
                </label>

                <select
                  value={experienceLevel}
                  onChange={(event) =>
                    setExperienceLevel(event.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-primary"
                >
                  <option value="">Any Experience</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>

              {actionError && (
                <p className="text-sm text-red-600">{actionError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={18} />
                {isSubmitting ? "Creating..." : "Create Job Alert"}
              </button>
            </form>
          </section>

          <section>
            <h2 className="mb-5 text-lg font-bold text-brand-text">
              Your Alerts ({jobAlerts.length})
            </h2>

            {isLoading ? (
              <p className="rounded-xl bg-white py-12 text-center text-sm text-muted-foreground">
                Loading job alerts...
              </p>
            ) : jobAlerts.length > 0 ? (
              <div className="space-y-4">
                {jobAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-2xl border border-border bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-bold text-brand-text">
                          {alert.name}
                        </h3>

                        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                          {alert.category && (
                            <p>{alert.category}</p>
                          )}

                          {alert.location && (
                            <p className="flex items-center gap-2">
                              <MapPin size={15} />
                              {alert.location}
                            </p>
                          )}

                          {alert.employment_type && (
                            <p className="flex items-center gap-2">
                              <BriefcaseBusiness size={15} />
                              {alert.employment_type}
                            </p>
                          )}

                          {alert.experience_level && (
                            <p>{alert.experience_level}</p>
                          )}

                          {!alert.category &&
                            !alert.location &&
                            !alert.employment_type &&
                            !alert.experience_level && (
                              <p>Matching all job categories and locations</p>
                            )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => void handleDelete(alert.id)}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                        aria-label="Delete job alert"
                        title="Delete alert"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <span
                        className={`text-xs font-semibold ${alert.is_active
                            ? "text-green-600"
                            : "text-muted-foreground"
                          }`}
                      >
                        {alert.is_active ? "Active" : "Inactive"}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          void handleToggleActive(
                            alert.id,
                            alert.is_active
                          )
                        }
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-brand-text transition hover:bg-gray-50"
                      >
                        {alert.is_active ? "Pause Alert" : "Activate Alert"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
                <BellRing
                  size={32}
                  className="mx-auto text-muted-foreground"
                />

                <h3 className="mt-4 font-bold text-brand-text">
                  No job alerts yet
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Create your first alert to get started.
                </p>
              </div>
            )}
          </section>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}
      </div>
    </main>
  );
}
