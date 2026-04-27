import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { SearchIcon, ArrowUpDownIcon, FilterIcon } from "lucide-react";

import type { IProject } from "../types";
import { getAllUserProjects, toggleProjectPublish } from "../axios/userApi/userApi";
import { myGenerationsText, communityText, ellipsisMenuText } from "../../public/assets/data";
import { useLanguage } from "../context/LanguageContext";

import Title from "../components/Title";
import CommunityProjectCard from "./CommunityProjectCard";
import EllipsisMenu from "../components/EllipsisMenu";
import Loader2Icon from "../components/Loader2Icon";
import { PrimaryButton, GhostButton } from "../components/Buttons";

// Shared input/select style — visible on dark background
// Style chung cho input/select — hiển thị rõ trên nền tối
const filterClass = "rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-white text-sm font-medium focus:outline-none focus:border-violet-400 transition appearance-none";

export default function MyGenerations() {
    const [generations, setGenerations] = useState<IProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filterType, setFilterType] = useState<string>('');

    const { language } = useLanguage();
    const navigate = useNavigate();
    const { isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    const t = myGenerationsText[language];

    // Debounce search input — wait 400ms before firing API call
    // Debounce search — đợi 400ms trước khi gọi API để tránh gọi liên tục
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch projects — only when signed in
    // Chỉ fetch khi đã đăng nhập
    useEffect(() => {
        if (!isSignedIn) return;

        setLoading(true);
        getAllUserProjects({
            search: debouncedSearch || undefined,
            sortBy,
            sortOrder,
            type: filterType || undefined,
        })
            .then(res => setGenerations(res.data.projects))
            .catch(() => setGenerations([]))
            .finally(() => setLoading(false));
    }, [isSignedIn, debouncedSearch, sortBy, sortOrder, filterType]);

    const handleDelete = (idx: number) => {
        setGenerations(gens => gens.filter((_, i) => i !== idx));
    };

    const handleTogglePublish = async (idx: number, id: string) => {
        await toggleProjectPublish(id);
        setGenerations(gens =>
            gens.map((g, i) => i === idx ? { ...g, isPublished: !g.isPublished } : g)
        );
    };

    if (!isSignedIn) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Title
                    title={t.signInTitle || "Sign In Required"}
                    description={t.signInDescription || "Please sign in to view your generations."}
                />
                <PrimaryButton onClick={openSignIn}>
                    {t.getStarted || "Get Started"}
                </PrimaryButton>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white/2">
            <div className="app-container max-md:w-screen flex items-center justify-center">
                <div className="w-full shadow-xl">

                    <Title
                        title={t.title}
                        description={t.description}
                    />

                    {/* ── Filters ── */}
                    <div className="flex flex-wrap gap-3 mt-8 mb-6">

                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className={`${filterClass} w-full pl-9`}
                            />
                        </div>

                        {/* Sort by */}
                        <select
                            title="Sort by"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className={filterClass}
                        >
                            <option value="createdAt" className="bg-gray-900">Newest first</option>
                            <option value="name" className="bg-gray-900">Name</option>
                        </select>

                        {/* Sort order */}
                        <select
                            title="Sort order"
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
                            className={filterClass}
                        >
                            <option value="desc" className="bg-gray-900">Descending</option>
                            <option value="asc" className="bg-gray-900">Ascending</option>
                        </select>

                        {/* Filter type */}
                        <select
                            title="Filter by type"
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            className={filterClass}
                        >
                            <option value="" className="bg-gray-900">All types</option>
                            <option value="video" className="bg-gray-900">Video only</option>
                            <option value="image" className="bg-gray-900">Image only</option>
                        </select>

                    </div>

                    {/* ── Loading ── */}
                    {loading && (
                        <div className="flex flex-col justify-center items-center h-40 gap-4">
                            <Loader2Icon className="w-10 h-10 text-indigo-500" />
                            <span className="text-base text-gray-300 font-medium tracking-wide">
                                Loading your generations...
                            </span>
                        </div>
                    )}

                    {/* ── Empty state ── */}
                    {!loading && generations.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-6 mt-10">
                            <Title
                                title={t.emptyTitle}
                                description={t.emptyDesc}
                            />
                            <Link to="/dashboard/generate">
                                <PrimaryButton>{t.createNew}</PrimaryButton>
                            </Link>
                        </div>
                    )}

                    {/* ── Results ── */}
                    {!loading && generations.length > 0 && (
                        <>
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mt-6">
                                {generations.map((project, idx) => (
                                    <div key={project.id} className="break-inside-avoid mb-6 relative">
                                        <CommunityProjectCard
                                            project={project}
                                            actions={
                                                <div className="grid grid-cols-2 gap-2">
                                                    <GhostButton onClick={() => navigate(`/dashboard/result/${project.id}`)}>
                                                        {t.viewDetails}
                                                    </GhostButton>
                                                    <PrimaryButton onClick={() => handleTogglePublish(idx, project.id)}>
                                                        {project.isPublished ? t.unpublish : t.publish}
                                                    </PrimaryButton>
                                                </div>
                                            }
                                        />
                                        <div className="absolute top-4 right-4 z-40">
                                            <EllipsisMenu
                                                imageUrl={project.generatedImage || project.uploadedImages?.[0]}
                                                videoUrl={project.generatedVideo}
                                                onDelete={() => handleDelete(idx)}
                                                text={ellipsisMenuText[language]}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center mt-10">
                                <Link to="/dashboard/generate">
                                    <PrimaryButton>{t.createNew}</PrimaryButton>
                                </Link>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}