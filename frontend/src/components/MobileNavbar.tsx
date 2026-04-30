import { Link } from "react-router-dom";
import { navbarData, languages } from "../../public/assets/data";
import { PrimaryButton } from "./Buttons";
import DropdownMenu from "./DropdownMenu";
import UserMenu from "./UserMenu";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useLanguage } from "../context/LanguageContext";
import { XIcon, MenuIcon } from "lucide-react";
export default function MobileNavbar({
  isOpen,
  setIsOpen,
  signIn,
  getStarted,
  setLanguage,
  language,
  credits,
}: any) {
  const { user } = useUser();
  const { openSignIn, openSignUp } = useClerk();
  return (
    <>
      <div className="flex md:hidden items-center gap-3">
        {!user ? (
          <button
            type="button"
            onClick={() => setIsOpen((prev: boolean) => !prev)}
            aria-label="Open menu"
          >
            <MenuIcon className="size-6" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <DropdownMenu
              title={
                languages.find((l) => l.code === language)?.label || "Select"
              }
              options={languages.map((l) => l.label)}
              onSelect={(label) => {
                const lang = languages.find((l) => l.label === label)?.code;
                if (lang) setLanguage(lang as any);
              }}
            />
            <UserMenu credits={credits} />
          </div>
        )}
      </div>
      {/* Mobile menu overlay */}
      {!user && (
        <div
          className={`flex flex-col items-center justify-center gap-6 text-lg font-medium fixed inset-0 bg-black/40 backdrop-blur-md z-50 transition-all duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 rounded-md bg-white p-2 text-gray-800 ring-white active:ring-2"
            aria-label="Close menu"
          >
            <XIcon />
          </button>
          {navbarData.navLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => {
                setIsOpen(false);
                window.scrollTo(0, 0);
              }}
              className={`dashboard-menu-mobile-link${item.href === "/" ? " home" : ""}`}
            >
              {item.text[language]}
            </Link>
          ))}
          <button
            onClick={() => {
              setIsOpen(false);
              openSignIn();
            }}
            className="font-medium text-gray-300 hover:text-white transition"
          >
            {signIn}
          </button>
          <PrimaryButton
            onClick={() => {
              setIsOpen(false);
              openSignUp();
            }}
          >
            {getStarted}
          </PrimaryButton>
          <DropdownMenu
            title={
              languages.find((l) => l.code === language)?.label || "Select"
            }
            options={languages.map((l) => l.label)}
            onSelect={(label) => {
              const lang = languages.find((l) => l.label === label)?.code;
              if (lang) setLanguage(lang as any);
            }}
          />
        </div>
      )}
    </>
  );
}
