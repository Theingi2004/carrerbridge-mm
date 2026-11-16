
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { jobCategories } from "../data/job-categories";
import CategoryCard from "./CategoryCard";

export default function JobCategories() {
  return (
    <section className="bg-brand-background py-20 sm:py-24">
      <div className="container-default">

        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-secondary">
              Explore By Expertise
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
              Browse Job Categories
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Find opportunities that match your skills,
              interests, and career goals.
            </p>
          </div>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition-all duration-200 hover:gap-3"
          >
            Explore All Jobs
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
