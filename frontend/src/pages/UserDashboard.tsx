import { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  WandSparkles,
  Film,
  Zap,
  Clock,
  Star,
  ChevronRight,
  LayoutDashboard,
  FolderOpen,
  Users,
  DollarSign,
  Plus,
} from "lucide-react";
import { getUserCredit } from "../axios/userApi/userApi";

// ─── Sidebar Nav Item ────────────────────────────────────────────────────────
const NavItem = ({
  icon: Icon,
  label,
  to,
}: {
  icon: any;
  label: string;
  to: string;
}) => {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
          : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
};

// ─── Dashboard Layout ────────────────────────────────────────────────────────
export default function DashboardLayout() {
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
      <aside className="hidden md:flex flex-col w-60 border-r border-white/5 pt-24 pb-6 px-4 gap-1 fixed top-0 left-0 h-full z-30">
        {/* User info */}
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <img
            src={user?.imageUrl}
            alt="avatar"
            className="w-8 h-8 rounded-full ring-2 ring-violet-500/40 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-white/30 text-xs truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        {/* New Project button */}
        <button
          onClick={() => navigate("/generate")}
          className="flex items-center gap-2 mx-2 mb-3 px-4 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>

        {/* Nav links */}
        <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
        <NavItem icon={WandSparkles} label="Generate" to="/generate" />
        <NavItem
          icon={FolderOpen}
          label="My Generations"
          to="/my-generations"
        />
        <NavItem icon={Users} label="Community" to="/community" />
        <NavItem icon={DollarSign} label="Plans" to="/plan" />

        {/* Credits pill */}
        <div className="mt-auto mx-2">
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
                className="bg-violet-500 h-1.5 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, ((credits ?? 0) / 100) * 100)}%`,
                }}
              />
            </div>
            <Link
              to="/plan"
              className="text-violet-400 text-xs font-medium hover:text-violet-300 transition flex items-center gap-1"
            >
              Get more <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Main Content — children render here ── */}
      <main className="flex-1 md:ml-60 pt-24 pb-12 px-4 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}
