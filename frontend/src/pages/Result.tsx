import { useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { ResultText } from "../../public/assets/data";
import Title from "../components/Title";
import { PrimaryButton, GhostButton } from "../components/Buttons";
import { WandSparkles, Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";
import { getProjectById } from "../axios/userApi/userApi";
import { generateVideo } from "../axios/projectApi/projectApi";

// Map project aspectRatio string to Tailwind aspect ratio class
const getAspectClass = (aspectRatio?: string) => {
  switch (aspectRatio) {
    case "16:9":
      return "aspect-video";
    case "9:16":
    default:
      return "aspect-[9/16]";
  }
};

export default function Result() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [additionalVideoPrompt, setAdditionalVideoPrompt] = useState("");
  const promptInputRef = useRef<HTMLInputElement>(null);

  // Fetch project on mount
  useEffect(() => {
    if (id) {
      getProjectById(id)
        .then((res) => setProject(res.data.project))
        .catch(() => setProject(null));
    }
  }, [id]);

  const imageUrl = project?.generatedImage || project?.uploadedImages?.[0];
  const videoUrl = project?.generatedVideo;
  const hasImage = !!imageUrl;
  const hasVideo = !!videoUrl;
  const aspectClass = getAspectClass(project?.aspectRatio);

  // Download file from URL
  const download = (url: string, filename: string) => {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      });
  };

  // Submit video generation request
  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasImage || isGenerating) return;
    setIsGenerating(true);
    try {
      await generateVideo(project.id, additionalVideoPrompt);
      toast.success(
        ResultText[language].congratulations || "Video generated successfully!",
      );
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      toast.error(
        ResultText[language].errorToast ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Project not found state
  if (!project)
    return (
      <div className="min-h-screen bg-white/2">
        <div className="app-container max-md:w-screen flex items-center justify-center">
          <div className="flex justify-center items-center h-40 text-lg font-semibold text-gray-500">
            Not found
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white/2">
      <div className="app-container max-md:w-screen flex items-center justify-center">
        <div className="w-full shadow-xl">
          <Title
            title={ResultText[language].resultTitle}
            description={ResultText[language].resultDescription}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 mt-10 md:mt-25">
            {/* Left: Image & Video previews */}
            <div className="flex flex-col gap-6">
              {/* Generated image — respects project aspect ratio */}
              <div
                className={`w-full ${aspectClass} bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden`}
              >
                {hasImage ? (
                  <img
                    src={imageUrl}
                    alt="Generated"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400">
                    {ResultText[language].noImage}
                  </span>
                )}
              </div>

              {/* Generated video — respects project aspect ratio */}
              {hasVideo && (
                <div
                  className={`w-full ${aspectClass} bg-white/10 rounded-2xl border border-white/10 overflow-hidden`}
                >
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Right: Download & generation actions */}
            <div className="flex flex-col gap-6">
              {/* Download section */}
              <div className="flex flex-col gap-4 bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-base font-semibold text-white">
                  {ResultText[language].downloads}
                </h3>
                <GhostButton
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium bg-violet-500 hover:bg-violet-600 text-white transition disabled:opacity-40 disabled:pointer-events-none"
                  disabled={!hasImage || isGenerating}
                  onClick={() => hasImage && download(imageUrl!, "image.png")}
                >
                  {ResultText[language].downloadImage}
                </GhostButton>
                <GhostButton
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium bg-violet-500 hover:bg-violet-600 text-white transition disabled:opacity-40 disabled:pointer-events-none"
                  disabled={!hasVideo || isGenerating}
                  onClick={() => hasVideo && download(videoUrl!, "video.mp4")}
                >
                  {ResultText[language].downloadVideo}
                </GhostButton>
              </div>

              {/* Video generation section */}
              <div className="flex flex-col gap-4 bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-base font-semibold text-white">
                  {ResultText[language].videoMagic}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {ResultText[language].videoMagicDesc}
                </p>

                {hasVideo ? (
                  // Video already exists — show success message
                  <div className="heading-color font-semibold text-center text-sm">
                    {ResultText[language].congratulations}
                  </div>
                ) : (
                  // No video yet — show generation form
                  <form
                    className="flex flex-col gap-2"
                    onSubmit={handleGenerateVideo}
                  >
                    <input
                      ref={promptInputRef}
                      type="text"
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder={
                        ResultText[language].promptPlaceholder ||
                        "Add additional instructions for the video..."
                      }
                      value={additionalVideoPrompt}
                      onChange={(e) => setAdditionalVideoPrompt(e.target.value)}
                      disabled={isGenerating}
                    />
                    <PrimaryButton
                      type="submit"
                      className="w-full"
                      disabled={!hasImage || isGenerating}
                    >
                      {isGenerating ? (
                        <span className="flex items-center gap-2 justify-center">
                          <Loader2Icon className="w-5 h-5 animate-spin" />
                          {ResultText[language].generatingFriendly ||
                            "Please wait a few seconds while we create your magic!"}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 justify-center">
                          <WandSparkles className="w-5 h-5 mr-2" />
                          {ResultText[language].generate}
                        </span>
                      )}
                    </PrimaryButton>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
