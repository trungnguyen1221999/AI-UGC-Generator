import DropdownMenu from "./DropdownMenu";
import { useLanguage } from "../context/LanguageContext";
import { languages, sidebarText, dashboardMenu } from "../../public/assets/data";
import "./DashboardMenu.css";
import * as Icons from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  WandSparkles, Film, Zap, Clock, Star, ChevronRight, LayoutDashboard,
  FolderOpen, Users, DollarSign, Plus, MenuIcon, XIcon,
} from "lucide-react";
import { getUserCredit } from "../axios/userApi/userApi";
import { assets } from '../../public/assets/assets';
import UserMenu from "./UserMenu";

// ─── Sidebar Nav Item ────────────────────────────────────────────────────────
const NavItem = ({ icon: Icon, label, to, onClick }: { icon: any; label: string; to: string; onClick?: () => void }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`dashboard-menu-link${active ? ' active' : ''}`}
      onClick={onClick}
    >
      <Icon className="dashboard-menu-icon" />
      {label}
    </Link>
  );
};

// ─── Dashboard Layout ────────────────────────────────────────────────────────
export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage } = useLanguage();
  const { user } = useUser();
  const navigate = useNavigate();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    getUserCredit()
      .then((res) => setCredits(res.data.credits))
      .catch(() => setCredits(null));
  }, []);


  return (
    <div className="min-h-screen flex bg-gray-950">

      {/* ── Sidebar ── */}
        <aside className="hidden md:flex flex-col w-60 border-r border-white/5 py-5 px-4 gap-1 fixed top-0 left-0 h-full z-30">
          <Link to='/' onClick={() => window.scrollTo(0, 0)}>
            <img src={assets.logo} alt="logo" className="h-9 md:h-15 px-4 py-3" />
          </Link>
          {/* User info (hide if not logged in) */}
          {user && (
            <div className="flex items-center gap-3 px-4 py-3 mb-4">
              <UserMenu />
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-white/30 text-xs truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          )}
  
          {/* New Project button */}
          <button
            onClick={() => navigate("/dashboard/generate")}
            className="flex items-center gap-2 mx-2 mb-3 px-4 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20"
          >
            <Plus className="w-4 h-4" />
            {sidebarText.newProject[language]}
          </button>
  
          {/* Nav links (auto from dashboardMenu) */}
          {dashboardMenu.map(item => {
            const Icon = Icons[item.icon];
            return (
              <NavItem
                key={item.route}
                icon={Icon}
                label={sidebarText[item.i18nKey][language]}
                to={item.route}
                onClick={() => window.scrollTo(0, 0)}
              />
            );
          })}
  
          {/* Credits pill */}
          <div className="mt-auto mx-2 flex flex-col gap-2">
            <div className="glass-panel rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-xs font-medium">Credits</span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {credits ?? "—"}
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className={`bg-violet-500 h-1.5 rounded-full transition-all duration-700 dashboard-credits-bar`}
                  style={{ width: `${Math.min(100, ((credits ?? 0) / 100) * 100)}%` }}
                />
              </div>
              <Link
                to="/dashboard/plan"
                onClick={() => window.scrollTo(0, 0)}
                className="text-violet-400 text-xs font-medium hover:text-violet-300 transition flex items-center gap-1"
              >
                Get more <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </aside>
  
  
  
        {/* Mobile right: Hamburger menu if not signed in, UserMenu if signed in */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          {!user ? (
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Open menu"
              className="p-3 rounded-full bg-gray-800 text-white shadow-lg"
            >
              <MenuIcon className="size-6" />
            </button>
          ) : (
            <UserMenu />
          )}
        </div>
  
        {/* Mobile menu overlay (show only if not signed in and isOpen) */}
        {!user && isOpen && (
          <div className="flex flex-col items-center justify-center gap-6 text-lg font-medium fixed inset-0 bg-black/40 backdrop-blur-md z-50 transition-all duration-300">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 rounded-md bg-white p-2 text-gray-800 ring-white active:ring-2"
              aria-label="Close menu"
            >
              <XIcon />
            </button>
            {dashboardMenu.map(item => {
              const Icon = Icons[item.icon];
              return (
                <Link
                  key={item.route}
                  to={item.route}
                  onClick={() => {setIsOpen(false); window.scrollTo(0, 0);}}
                  className={`dashboard-menu-mobile-link${item.i18nKey === 'home' ? ' home' : ''}`}
                >
                  <Icon className="dashboard-menu-icon" />
                  {sidebarText[item.i18nKey][language]}
                </Link>
              );
            })}
          </div>
        )}
  
      {/* ── Main Content — children render here ── */}
      <main className="flex-1 md:ml-60 py-10 px-4 md:px-8">
        <div className="app-container">
          <Outlet />
          <div className="absolute top-8 right-8">
            <DropdownMenu 
                title={languages.find(l => l.code === language)?.label || 'Select'}
                options={languages.map(l => l.label)}
                onSelect={label => {
                  const lang = languages.find(l => l.label === label)?.code;
                  if (lang) setLanguage(lang as any);
                }}
              />
          </div>
        </div>
      </main>
    </div>
  );
}