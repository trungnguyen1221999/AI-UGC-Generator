import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { XIcon } from "lucide-react";

import type { IProject } from "../types";
import { dummyGenerations } from "../../public/assets/assets";
import { myGenerationsText, communityText, ellipsisMenuText } from "../../public/assets/data";
import { useLanguage } from "../context/LanguageContext";

import Title from "../components/Title";
import CommunityProjectCard from "./CommunityProjectCard";
import EllipsisMenu from "../components/EllipsisMenu";
import Loader2Icon from "../components/Loader2Icon";
import { PrimaryButton, GhostButton } from "../components/Buttons";

export default function MyGenerations() {
    const [generations, setGenerations] = useState<IProject[]>([]);
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setGenerations(dummyGenerations);
            setLoading(false);
        }, 1000);
    }, []);

    const handleDelete = (idx: number) => {
        setGenerations(gens => gens.filter((_, i) => i !== idx));
    };

    const handleTogglePublish = (idx: number) => {
        setGenerations(gens =>
            gens.map((g, i) => i === idx ? { ...g, isPublished: !g.isPublished } : g)
        );
    };

    return (
        <div className="min-h-screen py-15 md:py-20 bg-white/2">
            <div className="app-container max-md:w-screen pt-10 md:pt-26 flex items-center justify-center">
                <div className="w-full shadow-xl p-10">

                    {loading && (
                        <div className="flex flex-col justify-center items-center h-40 gap-4">
                            <Loader2Icon className="w-10 h-10 text-indigo-500" />
                            <span className="text-base text-gray-300 font-medium tracking-wide">
                                {communityText[language].loading.replace('community projects', 'your generations')}
                            </span>
                        </div>
                    )}

                    {!loading && generations.length === 0 && (
                        <>
                            <Title
                                title={myGenerationsText[language].emptyTitle}
                                description={myGenerationsText[language].emptyDesc}
                            />
                            <div className="flex flex-col items-center justify-center gap-6">
                                <Link to="/generate">
                                    <PrimaryButton>{myGenerationsText[language].createNew}</PrimaryButton>
                                </Link>
                            </div>
                        </>
                    )}

                    {!loading && generations.length > 0 && (
                        <>
                            <Title
                                title={myGenerationsText[language].title}
                                description={myGenerationsText[language].description}
                            />

                            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mt-10 md:mt-16">
                                {generations.map((project, idx) => (
                                    <div key={project.id} className="break-inside-avoid mb-6 relative">

                                        <CommunityProjectCard
                                            project={project}
                                            actions={
                                                <div className="grid grid-cols-2 gap-2">
                                                    <GhostButton onClick={() => navigate(`/result/${project.id}`)}>
                                                        {myGenerationsText[language].viewDetails}
                                                    </GhostButton>
                                                    <PrimaryButton onClick={() => handleTogglePublish(idx)}>
                                                        {project.isPublished ? myGenerationsText[language].unpublish : myGenerationsText[language].publish}
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
                                <Link to="/generate">
                                    <PrimaryButton>{myGenerationsText[language].createNew}</PrimaryButton>
                                </Link>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}