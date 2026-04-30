import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { getUserCredit } from "../axios/userApi/userApi";
import { ScrollLock } from "../helpers/scrollLock";
import { useLanguage } from "../context/LanguageContext";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { assets } from "../../public/assets/assets";
import Logo from "./Logo";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { user } = useUser();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      getUserCredit()
        .then((res) => setCredits(res.data.credits))
        .catch(() => setCredits(null));
    } else {
      setCredits(null);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) ScrollLock.preventScrolling();
    else ScrollLock.restoreScrolling();
    return () => ScrollLock.restoreScrolling();
  }, [isOpen]);

  const signIn = language === "fi" ? "Kirjaudu sisään" : "Sign in";
  const getStarted = language === "fi" ? "Aloita" : "Get Started";

  return (
    <motion.nav
      className="fixed top-5 left-0 right-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
    >
      <div className="app-container">
        <div className="w-full flex items-center justify-between md:py-3">
          <Logo />
          <DesktopNavbar
            credits={credits}
            signIn={signIn}
            getStarted={getStarted}
            setLanguage={setLanguage}
            language={language}
          />
          <MobileNavbar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            signIn={signIn}
            getStarted={getStarted}
            setLanguage={setLanguage}
            language={language}
          />
        </div>
      </div>
    </motion.nav>
  );
}
