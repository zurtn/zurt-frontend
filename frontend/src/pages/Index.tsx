import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import LandingStyles from "@/components/landing/LandingStyles";
import PremiumHero from "@/components/landing/PremiumHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import PricingSection from "@/components/landing/PricingSection";
import LandingFAQ from "@/components/landing/LandingFAQ";
import Footer from "@/components/landing/Footer";

const Index = () => {
  const { hash } = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetId = hash?.replace("#", "");
    if (targetId) {
      const el = document.getElementById(targetId);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const els = document.querySelectorAll(".landing-reveal");
    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div ref={mainRef} className="landing-page min-h-screen grain-overlay" style={{ background: '#000' }}>
      <LandingStyles />
      <Navbar />
      <main>
        <PremiumHero />
        <LandingFeatures />
        <PricingSection />
        <LandingFAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
