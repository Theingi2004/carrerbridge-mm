import CareerCTA from "@/features/home/components/CareerCTA";
import FeaturedJobs from "@/features/home/components/FeaturedJobs";
import HeroSection from "@/features/home/components/HeroSection";
import HowItWorks from "@/features/home/components/HowItWorks";
import JobCategories from "@/features/home/components/JobCategories";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedJobs />
      <JobCategories />
      <HowItWorks />
      <CareerCTA />
    </main>
  );
}