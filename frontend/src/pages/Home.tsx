import Hero from "../components/Hero";
import Features from "../components/Features";
import CompareSection from "../components/CompareSection";
import Pricing from "../components/Pricing";
import Faq from "../components/Faq";
import CTA from "../components/CTA";
import FeatureProof from "../components/FeatureProof";

export default function Home() {
    return (
        <>
            <Hero />
            <Features />
             <FeatureProof />
            <CompareSection />
            <Pricing />
            <Faq />
            <CTA />
        </>
    )
}