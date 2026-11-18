"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type {
  Profile,
  ProfileFormValues,
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

  const [form, setForm] = useState<ProfileFormValues>({
    full_name: profile.full_name,
    phone: profile.phone ?? "",
    headline: profile.headline ?? "",
    location: profile.location ?? "",
    skills: profile.skills ?? [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(profile.avatar_url ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClient();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (
      form.skills.some(
        (item) => item.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setSkillInput("");
      return;
    }

    setForm((previous) => ({
      ...previous,
      skills: [...previous.skills, skill],
    }));

    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setForm((previous) => ({
      ...previous,
      skills: previous.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  const handleAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Image must be smaller than 2 MB.");
      return;
    }

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
    setErrorMessage("");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setIsSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      let avatarUrl = profile.avatar_url;

      // Step 1: Upload the selected image.
      if (avatarFile) {
        const fileExtension =
          avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";

        const filePath =
          `${userId}/${crypto.randomUUID()}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, {
            upsert: false,
            contentType: avatarFile.type,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = data.publicUrl;
      }

      // Step 2: Update the profile in the database.
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: form.full_name.trim(),
          phone: form.phone.trim() || null,
          headline: form.headline.trim() || null,
          location: form.location.trim() || null,
          skills: form.skills,
          avatar_url: avatarUrl,
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      setMessage("Profile updated successfully!");
      setAvatarFile(null);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture */}
      <section className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-lg font-bold text-brand-text">
          Profile Picture
        </h2>

        <div className="mt-5 flex flex-wrap items-center gap-5">
          {preview ? (
            <img
              src={preview}
              alt="Profile preview"
              className="h-24 w-24 rounded-full border object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-primary/10 text-2xl font-bold text-brand-primary">
              {form.full_name.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <div>
            <label
              htmlFor="avatar"
              className="inline-block cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-primary/5"
            >
              Choose Image
            </label>

            <input
              id="avatar"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatarChange}
              className="sr-only"
            />

            <p className="mt-2 text-xs text-muted-foreground">
              PNG, JPG or WebP. Maximum 2 MB.
            </p>
          </div>
        </div>
      </section>

      {/* Personal Information */}
      <section className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-lg font-bold text-brand-text">
          Personal Information
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <FormField
            label="Full Name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />

          <FormField
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <FormField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Yangon, Myanmar"
          />
        </div>
      </section>

      {/* Professional Information */}
      <section className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-lg font-bold text-brand-text">
          Professional Information
        </h2>

        <div className="mt-5">
          <label
            htmlFor="headline"
            className="mb-2 block text-sm font-medium"
          >
            Professional Headline
          </label>

          <textarea
            id="headline"
            name="headline"
            rows={3}
            value={form.headline}
            onChange={handleChange}
            placeholder="Example: Junior Frontend Developer | React & Next.js"
            className="w-full rounded-lg border border-border p-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium">
            Skills
          </label>

          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Enter a skill"
              className="h-11 min-w-0 flex-1 rounded-lg border border-border px-3 text-sm outline-none focus:border-brand-primary"
            />

            <button
              type="button"
              onClick={addSkill}
              className="rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white active:scale-95"
            >
              Add
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-2 text-sm text-brand-primary"
              >
                {skill}

                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remove ${skill}`}
                  className="font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback */}
      {message && (
        <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      {errorMessage && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-primary/90 active:scale-95 disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
      />
    </div>
  );
}