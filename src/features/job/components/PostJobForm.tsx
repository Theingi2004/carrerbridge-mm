
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "../services/job.service";
import type { Job } from "../types/job.types";
import { demoRecruiter } from "@/features/auth/data/demo-user";
export default function PostJobForm() {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newJob: Job = {
      id: crypto.randomUUID(),
      recruiterId: demoRecruiter.id,
      title: formData.title.trim(),
      company: formData.company.trim(),
      location: formData.location.trim(),
      employmentType: formData.employmentType,
      experienceLevel: formData.experienceLevel,
      salary: formData.salary.trim(),
      postedAt: new Date().toISOString(),
      category: formData.category,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      description: formData.description.trim(),
      responsibilities: formData.responsibilities.split("\n").map((item) => item.trim()).filter(Boolean),
      requirements: formData.requirements.split("\n").map((item) => item.trim()).filter(Boolean),
      benefits: formData.benefits.split("\n").map((item) => item.trim()).filter(Boolean),
    };

    if (!newJob.title || !newJob.company || !newJob.description || !newJob.category) {
      setError("Please complete all required fields.");
      return;
    }

    createJob(newJob);

    router.push("/dashboard");
    router.refresh();
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium">Job Title *</label>
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
        <label className="mb-2 block text-sm font-medium">Company Name *</label>
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
        <label className="mb-2 block text-sm font-medium">Location</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={inputClass}
          placeholder="e.g. Yangon / Remote"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Employment Type</label>
          <select name="employmentType" value={formData.employmentType} onChange={handleChange} className={inputClass}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Contract</option>
            <option>Remote</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Experience Level</label>
          <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className={inputClass}>
            <option>Entry Level</option>
            <option>Junior</option>
            <option>Mid Level</option>
            <option>Senior</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Salary</label>
        <input name="salary" value={formData.salary} onChange={handleChange} className={inputClass} placeholder="e.g. Negotiable" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">IT Job Category *</label>
        <select name="category" value={formData.category} onChange={handleChange} required className={inputClass}>
          <option value="">Select category</option>
          <option>Frontend Development</option>
          <option>Backend Development</option>
          <option>Full Stack Development</option>
          <option>Mobile Development</option>
          <option>UI/UX Design</option>
          <option>Quality Assurance</option>
          <option>Data Analysis</option>
          <option>DevOps</option>
          <option>IT Support</option>
          <option>WordPress Development</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Tags (comma separated)</label>
        <input name="tags" value={formData.tags} onChange={handleChange} className={inputClass} placeholder="React, TypeScript, Next.js" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Job Description *</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} className={inputClass} />
      </div>

      {(["responsibilities", "requirements", "benefits"] as const).map((field) => (
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
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-lg bg-brand-primary px-5 py-3 font-semibold text-white hover:opacity-90"
      >
        Post Job
      </button>
    </form>
  );
}
