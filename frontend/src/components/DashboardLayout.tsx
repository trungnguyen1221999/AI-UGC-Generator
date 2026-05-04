import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useLanguage } from "../context/LanguageContext";
import MobileNavbar from "./MobileNavbar";
import Sidebar from "./Sidebar";
import Logo from "./Logo";
import { getUserCredit } from "../axios/userApi/userApi";
import { toast } from "react-toastify";

export default function DashboardLayout() {
  const { user } = useUser();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const signIn = language === "fi" ? "Kirjaudu sisään" : "Sign in";
  const getStarted = language === "fi" ? "Aloita" : "Get Started";

  useEffect(() => {
    if (user) {
      getUserCredit()
        .then((res) => {
          setCredits(res.data.credits);
        })
        .catch((error: any) => {
          setCredits(null);
          toast.error(
            error.response?.data?.message ||
              "Something went wrong. Please try again.",
          );
        });
    } else {
      setCredits(null);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex overflow-x-hidden">
      <div className="fixed top-9 left-4 md:hidden z-40">
        <Logo />
      </div>

      <Sidebar user={user} credits={credits} />

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <div className="md:hidden fixed top-9 right-6 z-50">
          <MobileNavbar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            signIn={signIn}
            getStarted={getStarted}
            setLanguage={setLanguage}
            language={language}
            credits={credits}
          />
        </div>

        <main
          className={`flex-1 min-h-screen md:pl-60 ${!user ? "flex items-center justify-center" : ""}`}
        >
          <div className="app-container py-10 mt-20 md:py-0 md:mt-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
