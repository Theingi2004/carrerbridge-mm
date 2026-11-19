
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  FileText,
  Code2,
  Save,
} from "lucide-react";

import { updateProfile } from "../services/profile.service";

import type {
  Profile,
  UpdateProfileInput,
} from "../types/profile.types";

interface ProfileFormProps {
  profile: Profile;
  userId: string;
}

export default function ProfileForm({
  profile,
  userId,
}: ProfileFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<UpdateProfileInput>({
    full_name: profile.full_name,
    phone: profile.phone,
    location: profile.location,
    headline: profile.headline,
    bio: profile.bio,
    skills: profile.skills,
    avatar_url: profile.avatar_url,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const skills = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    setFormData({
      ...formData,
      skills,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.full_name.trim()) {
      setError("Full name is required.");
      return;
    }

    try {
      setSaving(true);

      await updateProfile({
        ...formData,
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        headline: formData.headline.trim(),
        bio: formData.bio.trim(),
      });

      setSuccess("Profile updated successfully.");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-brand-text outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10";

  const labelClass =
    "mb-2 block text-sm font-semibold text-brand-text";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
            <UserRound size={36} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-text">
              {formData.full_name || "Your Profile"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {formData.headline || "Add your professional headline"}
            </p>
            <p className="mt-2 text-xs font-medium text-brand-secondary">
              Manage your CareerBridge MM profile
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-brand-text">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your basic contact information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>
              <UserRound size={15} className="mr-2 inline" />
              Full Name *
            </label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className={labelClass}>
              <Mail size={15} className="mr-2 inline" />
              Email Address
            </label>
            <input
              value={profile.email}
              disabled
              className={`${inputClass} cursor-not-allowed bg-gray-100 text-muted-foreground`}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Email cannot be changed here.
            </p>
          </div>

          <div>
            <label className={labelClass}>
              <Phone size={15} className="mr-2 inline" />
              Phone Number
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="09-123456789"
            />
          </div>

          <div>
            <label className={labelClass}>
              <MapPin size={15} className="mr-2 inline" />
              Location
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputClass}
              placeholder="Yangon, Myanmar"
            />
          </div>
        </div>
      </section>

      {/* Professional Information */}
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-brand-text">
            Professional Information
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Help recruiters understand your experience and skills.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>
              <BriefcaseBusiness size={15} className="mr-2 inline" />
              Professional Headline
            </label>
            <input
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              className={inputClass}
              placeholder="Junior Frontend Developer"
            />
          </div>

          <div>
            <label className={labelClass}>
              <FileText size={15} className="mr-2 inline" />
              About Me
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              className={`${inputClass} resize-y`}
              placeholder="Tell recruiters about yourself, your experience, and your career goals..."
            />
          </div>

          <div>
            <label className={labelClass}>
              <Code2 size={15} className="mr-2 inline" />
              Skills
            </label>
            <input
              value={formData.skills.join(", ")}
              onChange={handleSkillsChange}
              className={inputClass}
              placeholder="React, Next.js, TypeScript"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Separate each skill with a comma.
            </p>
          </div>
        </div>
      </section>

      {/* Feedback */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-8 py-3.5 font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}