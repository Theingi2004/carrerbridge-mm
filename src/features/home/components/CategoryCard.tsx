
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { JobCategory } from "../types/category.types";

interface CategoryCardProps {
  category: JobCategory;
}

export default function CategoryCard({
  category,
}: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <Link
      href={`/job?category=${category.slug}`}
      className="
        group flex h-full flex-col
        rounded-2xl border border-border bg-white p-6
        transition-all duration-200 ease-out
        hover:-translate-y-1 hover:border-brand-primary/30
        hover:shadow-lg active:scale-[0.98]
      "
    >
      <div className="flex items-center justify-between">
        <div className="
          flex size-12 items-center justify-center
          rounded-xl bg-brand-primary/10
          text-brand-primary transition-colors duration-200
          group-hover:bg-brand-primary group-hover:text-white
        ">
          <Icon size={23} />
        </div>

        <ArrowUpRight
          size={20}
          className="text-muted-foreground transition-all duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand-primary"
        />
      </div>

      <h3 className="mt-6 text-lg font-bold text-brand-text">
        {category.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {category.description}
      </p>

      <span className="mt-5 text-sm font-semibold text-brand-primary">
        Explore Jobs
      </span>
    </Link>
  );
}
