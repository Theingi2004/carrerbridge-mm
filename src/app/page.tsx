import FeaturedJobs from "@/features/home/components/FeaturedJobs";
import HeroSection from "@/features/home/components/HeroSection";
import JobCategories from "@/features/home/components/JobCategories";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedJobs />
      <JobCategories />
    </main>
  );
}