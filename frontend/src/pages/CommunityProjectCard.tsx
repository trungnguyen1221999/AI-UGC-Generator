

import React, { useRef } from "react";
import Card from "../components/Card";
import type { IProject } from "../types";
import { communityText } from "../../public/assets/data";
import { useLanguage } from "../context/LanguageContext";


interface CommunityProjectCardProps {
  project: IProject;
  actions?: React.ReactNode;
}

const CommunityProjectCard: React.FC<CommunityProjectCardProps> = ({ project, actions }) => {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasImage = project.uploadedImages && project.uploadedImages.length > 0;
  const hasVideo = !!project.generatedVideo;

  // Determine aspect ratio class
  let aspectClass = "aspect-9/16";
  if (project.aspectRatio === "1:1") aspectClass = "aspect-square";
  else if (project.aspectRatio === "16:9") aspectClass = "aspect-video";

  // Small floating model and product images
  const productImg = project.uploadedImages?.[0];
  const modelImg = project.uploadedImages?.[1];

  // Status logic
  let statusLabel = "";
  let statusColor = "";
  if (project.isGenerating) {
    statusLabel = "Generating...";
    statusColor = "bg-yellow-500 text-white";
  } else if (project.isPublished) {
    statusLabel = "Published";
    statusColor = "bg-green-600 text-white";
  } else {
    statusLabel = "Draft";
    statusColor = "bg-gray-500 text-white";
  }

  return (
    <Card className="flex flex-col gap-2 p-4 md:p-5">
      <div className="relative w-full mb-2">
        {/* Main media */}
        {hasImage ? (
          <div
            className={`relative w-full ${aspectClass}`}
            onMouseEnter={() => hasVideo && videoRef.current && videoRef.current.play()}
            onMouseLeave={() => hasVideo && videoRef.current && videoRef.current.pause()}
          >
            <img
              src={productImg}
              alt={project.productName}
              className="w-full h-full object-cover rounded-xl border border-white/10 bg-white/5"
            />
            {hasVideo && (
              <video
                ref={videoRef}
                src={project.generatedVideo}
                className="w-full h-full object-cover rounded-xl border border-white/10 absolute top-0 left-0 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10"
                muted
                loop
                playsInline
              />
            )}
            {/* Floating model and product images */}
            {(modelImg || productImg) && (
              <div className="absolute bottom-2 left-2 flex flex-row items-end gap-3 z-20">
                {productImg && (
                  <img
                    src={productImg}
                    alt="Product"
                    className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-indigo-400 drop-shadow-md bg-white/80 object-cover animate-float"
                  />
                )}
                {modelImg && (
                  <img
                    src={modelImg}
                    alt="Model"
                    className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-emerald-400 drop-shadow-md bg-white/80 object-cover animate-float"
                  />
                )}
              </div>
            )}
          </div>
        ) : hasVideo ? (
          <div className={`relative w-full ${aspectClass}`}
            onMouseEnter={() => videoRef.current && videoRef.current.play()}
            onMouseLeave={() => videoRef.current && videoRef.current.pause()}
          >
            <video
              ref={videoRef}
              src={project.generatedVideo}
              className="w-full h-full object-cover rounded-xl border border-white/10 bg-white/5"
              muted
              loop
              playsInline
            />
          </div>
        ) : null}
        {/* Status badge */}
        <div className={`absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-semibold shadow ${statusColor} z-30`}>{statusLabel}</div>
      </div>
      <div className="flex flex-col justify-between items-start text-left mt-2 gap-1 w-full">
        <span className="inline-block mb-1 px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-200 text-xs font-semibold">{project.aspectRatio}</span>
        <div className="text-base font-semibold text-white">
          <span className="heading-color font-bold">{communityText[language].productName}</span> {project.productName}
        </div>
        {project.productDescription && (
          <div className="text-sm text-gray-300">
            <span className="heading-color font-bold">{communityText[language].descriptionLabel}</span> {project.productDescription}
          </div>
        )}
        {project.userPrompt && (
          <div className="text-sm text-gray-400 italic">
            <span className="heading-color font-bold not-italic">{communityText[language].prompt}</span> {project.userPrompt}
          </div>
        )}
      </div>
      {actions && (
        <div className="mt-4">{actions}</div>
      )}
    </Card>
  );
};

export default CommunityProjectCard;
