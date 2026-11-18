
"use client";

import { useEffect, useState } from "react";

import MyApplications from "./MyApplications";
import { getMyApplications } from "../services/application.service";
import { demoUser } from "@/features/auth/data/demo-user";

import type { Application } from "../types/application.types";

export default function DemoMyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getMyApplications(demoUser.id);
        console.log("DemoMyApplications component is running");
        console.log("Demo user ID:", demoUser.id);
        console.log("Retrieved applications:", data);
        console.log("Application count:", data.length);

        setApplications(data);
      } catch (err) {
        console.error("Application loading error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load applications."
        );
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  if (loading) {
    return <p className="text-muted-foreground">Loading applications...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return <MyApplications applications={applications} />;
}
