import Hero from "../components/Hero";
import Features from "../components/Features";
import CompareSection from "../components/CompareSection";
import Pricing from "../components/Pricing";
import Faq from "../components/Faq";
import CTA from "../components/CTA";
import FeatureProof from "../components/FeatureProof";
import UseCases from "../components/UseCases";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (window.location.hash === "#pricing") {
      setTimeout(() => {
        const el = document.getElementById("pricing");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);
  return (
    <>
      <Hero />
      <FeatureProof />
      <Features />
      <CompareSection />
      <UseCases />
      <Pricing />
      <Faq />
      <CTA />
    </>
  );
}
