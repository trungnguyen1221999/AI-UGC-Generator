import { Link } from "react-router-dom";
import { navbarData, languages } from "../../public/assets/data";
import { PrimaryButton } from "./Buttons";
import DropdownMenu from "./DropdownMenu";
import UserMenu from "./UserMenu";
import { useUser, useClerk } from "@clerk/clerk-react";

export default function DesktopNavbar({
  credits,
  signIn,
  getStarted,
  setLanguage,
  language,
}: any) {
  /**
   * CLERK HOOKS
   * Must be called at the top level of the component to comply with React "Rules of Hooks".
   * This prevents the "Minified React error #321".
   */
  const { user } = useUser();
  const { openSignIn, openSignUp } = useClerk();

  return (
    <>
      {/* LEFT SIDE: Navigation Links */}
      <div className="hidden md:flex items-center gap-10 text-base font-medium text-gray-200 bg-white/10 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl px-8 py-3">
        {navbarData.navLinks.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => window.scrollTo(0, 0)}
            className="dashboard-menu-link"
          >
            {/* Display text based on selected language */}
            {item.text[language]}
          </Link>
        ))}
      </div>

      {/* RIGHT SIDE: Authentication & Language Selector */}
      <div className="hidden md:flex items-center gap-3">
        {!user ? (
          /* Case: User is NOT logged in */
          <>
            {/* Open Clerk's Sign In modal */}
            <button
              onClick={() => openSignIn()}
              className="text-base font-medium text-gray-200 hover:text-white transition"
            >
              {signIn}
            </button>

            {/* Open Clerk's Sign Up modal */}
            <PrimaryButton
              onClick={() => openSignUp()}
              className="hidden sm:inline-block"
            >
              {getStarted}
            </PrimaryButton>
          </>
        ) : (
          /* Case: User IS logged in */
          <div className="flex items-center gap-3">
            <UserMenu credits={credits} />
          </div>
        )}

        {/* Language Selection Dropdown */}
        <DropdownMenu
          title={languages.find((l) => l.code === language)?.label || "Select"}
          options={languages.map((l) => l.label)}
          onSelect={(label) => {
            // Find language code by label and update state
            const lang = languages.find((l) => l.label === label)?.code;
            if (lang) setLanguage(lang as any);
          }}
        />
      </div>
    </>
  );
}
