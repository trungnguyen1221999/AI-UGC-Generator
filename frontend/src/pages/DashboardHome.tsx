import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import {
  Plus,
  LayoutDashboard,
  WandSparkles,
  FolderOpen,
  DollarSign,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getUserCredit, getAllUserProjects } from "../axios/userApi/userApi";
import Title from "../components/Title";
import { PrimaryButton, GhostButton } from "../components/Buttons";
import type { IProject } from "../types";
import CommunityProjectCard from "./CommunityProjectCard";
import { dashboardQuickActionsText } from "../../public/assets/data";

export default function DashboardHome() {
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [credits, setCredits] = useState<number | null>(null);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) return;
    Promise.all([
      getUserCredit().then((res) => setCredits(res.data.credits)),
      getAllUserProjects({ sortBy: "createdAt", sortOrder: "desc" }).then(
        (res) => setProjects(res.data.projects.slice(0, 4)),
      ),
    ]).finally(() => setLoading(false));
  }, [isSignedIn]);

  if (!isSignedIn) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <Title
          title="Welcome to KaiUGC"
          description="Sign in to start generating AI-powered UGC content for your products."
        />
        <PrimaryButton onClick={() => openSignIn()} className="mt-6">
          Get Started
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="app-container">
        {/* ── Greeting ── */}
        <div className="mt-2 mb-6">
          <Title
            title={
              <>
                Welcome back,{" "}
                <span className="heading-color">
                  {user?.firstName || "there"}
                </span>{" "}
                👋
              </>
            }
          />
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
            <p className="uppercase tracking-widest mb-2">Credits</p>
            <p className="text-2xl font-bold text-violet-400">
              {credits ?? "—"}
            </p>
            <div className="h-1 bg-white/8 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-violet-600 rounded-full transition-all"
                style={{
                  width: credits
                    ? `${Math.min((credits / 500) * 100, 100)}%`
                    : "0%",
                }}
              />
            </div>
            <p className="text-white/60 mt-2">of 500 monthly</p>
          </div>

          <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
            <p className="uppercase tracking-widest mb-2">Projects</p>
            <p className="text-2xl font-bold text-white">
              {loading ? "—" : projects.length}
            </p>
            <p className="text-white/60 mt-3">total created</p>
          </div>

          <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
            <p className="uppercase tracking-widest mb-2">Generated</p>
            <p className="text-2xl font-bold text-white">
              {loading ? "—" : projects.length}
            </p>
            <p className="text-white/60 mt-3">videos & images</p>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <p className="uppercase tracking-widest mb-3">
          {dashboardQuickActionsText.quickActions[language]}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white/4 border border-white/8 hover:border-violet-500/50 hover:bg-violet-500/5 rounded-2xl p-5 flex items-center gap-4 transition text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0">
              <LayoutDashboard size={18} className="text-indigo-400" />
            </div>
            <p className="text-sm font-semibold">
              {dashboardQuickActionsText.dashboard[language]}
            </p>
          </button>

          <button
            onClick={() => navigate("/dashboard/generate")}
            className="bg-white/4 border border-white/8 hover:border-violet-500/50 hover:bg-violet-500/5 rounded-2xl p-5 flex items-center gap-4 transition text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
              <WandSparkles size={18} className="text-violet-400" />
            </div>
            <p className="text-sm font-semibold">
              {dashboardQuickActionsText.generate[language]}
            </p>
          </button>

          <button
            onClick={() => navigate("/dashboard/my-generations")}
            className="bg-white/4 border border-white/8 hover:border-violet-500/50 hover:bg-violet-500/5 rounded-2xl p-5 flex items-center gap-4 transition text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/12 flex items-center justify-center shrink-0">
              <FolderOpen size={18} className="text-teal-400" />
            </div>
            <p className="text-sm font-semibold">
              {dashboardQuickActionsText.myGenerations[language]}
            </p>
          </button>

          <button
            onClick={() => navigate("/dashboard/plan")}
            className="bg-white/4 border border-white/8 hover:border-violet-500/50 hover:bg-violet-500/5 rounded-2xl p-5 flex items-center gap-4 transition text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <DollarSign size={18} className="text-amber-400" />
            </div>
            <p className="text-sm font-semibold">
              {dashboardQuickActionsText.upgradePlan[language]}
            </p>
          </button>
        </div>

        {/* ── Recent Projects ── */}
        <div className="flex items-center justify-between mb-4">
          <p className="uppercase tracking-widest">
            {dashboardQuickActionsText.recentProjects[language]}
          </p>
          <GhostButton onClick={() => navigate("/dashboard/my-generations")}>
            {dashboardQuickActionsText.seeAll[language]}
          </GhostButton>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 text-white/60 text-sm">
            Loading...
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white/4 rounded-3xl border border-dashed border-white/10">
            <p className="text-white/30 text-sm mb-4">No projects yet</p>
            <button
              onClick={() => navigate("/dashboard/generate")}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-full transition text-sm"
            >
              <Plus size={16} />
              Create your first project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/dashboard/result/${project.id}`)}
                className="cursor-pointer"
              >
                <CommunityProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
