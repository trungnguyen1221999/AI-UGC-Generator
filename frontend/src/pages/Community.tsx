import { useEffect, useState } from "react";
import type { IProject } from "../types";
import { dummyGenerations } from "../../public/assets/assets";
import Title from "../components/Title";
import CommunityProjectCard from "./CommunityProjectCard";
import Loader2Icon from "../components/Loader2Icon";
import { communityText } from "../../public/assets/data";
import { useLanguage } from "../context/LanguageContext";

export default function Community() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  const fetchProjects = async () => {
    setTimeout(() => {
      setProjects(dummyGenerations);
      setLoading(false);
    }, 1000);
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <div className="min-h-screen py-15 md:py-20 bg-white/2">
      <div className="app-container max-md:w-screen pt-10 md:pt-26 flex items-center justify-center">
        <div className="w-full shadow-xl p-10">
          <Title
            title={communityText[language].title}
            description={communityText[language].description}
          />
          {loading ? (
            <div className="flex flex-col justify-center items-center h-40 gap-4">
              <Loader2Icon className="w-10 h-10 text-indigo-500" />
              <span className="text-base text-gray-300 font-medium tracking-wide">
                {communityText[language].loading}
              </span>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mt-10 md:mt-16">
              {projects.map((project) => (
                <div key={project.id} className="break-inside-avoid mb-6">
                  <CommunityProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
