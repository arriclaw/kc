import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { ForWhoSection } from "@/components/landing/for-who-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { ExampleSection } from "@/components/landing/example-section";
import { FeaturedTeaserSection } from "@/components/landing/featured-teaser-section";

export default function LandingPage() {
  return (
    <div className="space-y-6 pb-10 md:space-y-8">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <ExampleSection />
      <ForWhoSection />
      <FeaturedTeaserSection />
      <FinalCtaSection />
    </div>
  );
}
