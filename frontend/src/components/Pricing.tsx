import Title from "./Title";
import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { PricingTable } from "@clerk/clerk-react";
import { updateUserPlanAndCredits } from "../axios/userApi/updatePlan";
import { useCallback } from "react";
import { toast } from "react-toastify";

export default function Pricing() {
  const { language } = useLanguage();
  // Call this function after a successful plan change (e.g., after payment or plan selection)
  const handlePlanChange = useCallback(
    async (plan: string, credits: number) => {
      try {
        await updateUserPlanAndCredits({ plan, credits });
        // Optionally, show a toast or refresh credits in Navbar
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      }
    },
    [],
  );
  return (
    <section id="pricing" className="py-15 bg-white/3 border-t border-white/6">
      <div className="app-container">
        <Title
          title={language === "fi" ? "Hinnoittelu" : "Pricing"}
          heading={
            language === "fi"
              ? "Yksinkertainen, läpinäkyvä hinnoittelu"
              : "Simple, transparent pricing"
          }
          description={
            language === "fi"
              ? "Joustavat paketit startupeille, kasvaville tiimeille ja vakiintuneille brändeille."
              : "Flexible agency packages designed to fit startups, growing teams and established brands."
          }
        />

        <div className="flex flex-wrap items-center justify-center mx-auto gap-6">
          <PricingTable
            appearance={{
              variable: {
                colorBackground: "none",
              },
              element: {
                pricingTableCardBody: "bg-white/6",
                pricingTableCardHeader: "bg-white/10",
                switchThumb: "bg-white",
              },
            }}
            handlePlanChange={handlePlanChange}
          />
        </div>
      </div>
    </section>
  );
}
