import Hero from "../components/Hero";
import Features from "../components/Features";
import CompareSection from "../components/CompareSection";
import Pricing from "../components/Pricing";
import Faq from "../components/Faq";
import CTA from "../components/CTA";
import FeatureProof from "../components/FeatureProof";
import UseCases from "../components/UseCases";

export default function Home() {
    return (
        <>
            <Hero />
            <FeatureProof />
            <Features />
            <CompareSection />
            <UseCases/>
            <Pricing />
            <Faq />
            <CTA />
        </>
    )
}