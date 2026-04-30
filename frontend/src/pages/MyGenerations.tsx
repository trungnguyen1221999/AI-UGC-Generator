import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { SearchIcon, Plus } from "lucide-react";

import type { IProject } from "../types";
import {
  getAllUserProjects,
  toggleProjectPublish,
} from "../axios/userApi/userApi";
import { myGenerationsText, ellipsisMenuText } from "../../public/assets/data";
import { useLanguage } from "../context/LanguageContext";

import Title from "../components/Title";
import CommunityProjectCard from "./CommunityProjectCard";
import EllipsisMenu from "../components/EllipsisMenu";
import Loader2Icon from "../components/Loader2Icon";
import { PrimaryButton, GhostButton } from "../components/Buttons";

const FILTER_CLASS =
  "rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-white text-sm font-medium focus:outline-none focus:border-violet-400 transition appearance-none cursor-pointer hover:bg-white/15";

export default function MyGenerations() {
  const [generations, setGenerations] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<string>("");

  const { language } = useLanguage();
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const t = myGenerationsText[language];

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    if (!isSignedIn) return;
    setLoading(true);
    try {
      // Nhờ Interceptor, bạn không cần truyền token ở đây nữa
      const res = await getAllUserProjects({
        search: debouncedSearch || undefined,
        sortBy,
        sortOrder,
        type: filterType || undefined,
      });
      setGenerations(res.data.projects);
    } catch (error) {
      setGenerations([]);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, debouncedSearch, sortBy, sortOrder, filterType]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = (id: string) => {
    setGenerations((prev) => prev.filter((g) => g.id !== id));
  };

  const handleTogglePublish = async (idx: number, id: string) => {
    try {
      await toggleProjectPublish(id);
      setGenerations((prev) =>
        prev.map((g, i) =>
          i === idx ? { ...g, isPublished: !g.isPublished } : g,
        ),
      );
    } catch (error) {
      console.error("Failed to toggle publish status");
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <Title
          title={t.signInTitle || "Sign In Required"}
          description={
            t.signInDescription || "Please sign in to view your generations."
          }
        />
        <PrimaryButton onClick={() => openSignIn()} className="mt-6">
          {t.getStarted || "Get Started"}
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="app-container">
        <div className="w-full">
          <Title title={t.title} description={t.description} />

          {/* ── Filters Bar ── */}
          <div className="flex flex-wrap items-center gap-4 mt-10 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search by name or prompt..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${FILTER_CLASS} w-full pl-11 py-3`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={FILTER_CLASS}
              >
                <option value="createdAt" className="bg-slate-900">
                  Newest
                </option>
                <option value="name" className="bg-slate-900">
                  Name
                </option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className={FILTER_CLASS}
              >
                <option value="desc" className="bg-slate-900">
                  Desc
                </option>
                <option value="asc" className="bg-slate-900">
                  Asc
                </option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={FILTER_CLASS}
              >
                <option value="" className="bg-slate-900">
                  All Media
                </option>
                <option value="video" className="bg-slate-900">
                  Videos
                </option>
                <option value="image" className="bg-slate-900">
                  Images
                </option>
              </select>
            </div>
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <Loader2Icon className="w-12 h-12 text-violet-500 animate-spin" />
              <p className="text-white/60 animate-pulse font-medium">
                Retrieving your creations...
              </p>
            </div>
          ) : generations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <p className="text-white/40 mb-6">{t.emptyDesc}</p>
              <Link to="/dashboard/generate">
                <PrimaryButton className="flex items-center gap-2">
                  <Plus size={18} /> {t.createNew}
                </PrimaryButton>
              </Link>
            </div>
          ) : (
            <>
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mt-2">
                {generations.map((project, idx) => (
                  <div
                    key={project.id}
                    className="break-inside-avoid relative group overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]"
                  >
                    <CommunityProjectCard
                      project={project}
                      actions={
                        <div className="grid grid-cols-2 gap-2 p-1">
                          <GhostButton
                            className="text-xs py-2"
                            onClick={() =>
                              navigate(`/dashboard/result/${project.id}`)
                            }
                          >
                            {t.viewDetails}
                          </GhostButton>
                          <PrimaryButton
                            className="text-xs py-2"
                            onClick={() => handleTogglePublish(idx, project.id)}
                          >
                            {project.isPublished ? t.unpublish : t.publish}
                          </PrimaryButton>
                        </div>
                      }
                    />

                    {/* Ellipsis Actions Overlay */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                      <EllipsisMenu
                        imageUrl={
                          project.generatedImage || project.uploadedImages?.[0]
                        }
                        videoUrl={project.generatedVideo}
                        onDelete={() => handleDelete(project.id)}
                        text={ellipsisMenuText[language]}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-16">
                <Link to="/dashboard/generate">
                  <PrimaryButton className="px-10 py-4 text-lg shadow-xl hover:scale-105 transition-transform">
                    {t.createNew}
                  </PrimaryButton>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
