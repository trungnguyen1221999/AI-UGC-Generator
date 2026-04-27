import { useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { ResultText } from "../../public/assets/data";
import Title from "../components/Title";
import { PrimaryButton, GhostButton } from "../components/Buttons";
import { WandSparkles, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { getProjectById } from '../axios/userApi/userApi';
import { generateVideo } from '../axios/projectApi/projectApi';

export default function Result() {
    const { id } = useParams();
    const { language } = useLanguage();
    const [isGenerating, setIsGenerating] = useState(false);
    const [project, setProject] = useState<any>(null);

    useEffect(() => {
        if (id) {
            getProjectById(id).then(res => setProject(res.data.project)).catch(() => setProject(null));
        }
    }, [id]);

    const imageUrl = project?.generatedImage || project?.uploadedImages?.[0];
    const videoUrl = project?.generatedVideo;
    const hasImage = !!imageUrl;
    const hasVideo = !!videoUrl;

    const download = (url: string, filename: string) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            });
    };

    if (!project) return (
        <div className="min-h-screen bg-white/2">
            <div className="app-container max-md:w-screen flex items-center justify-center">
                <div className="w-full shadow-xl">
                    <div className="flex justify-center items-center h-40 text-lg font-semibold text-gray-500">
                        Not found
                    </div>
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

                        {/* Left: Image & Video */}
                        <div className="flex flex-col gap-6">
                            <div className="w-full aspect-square bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center">
                                {hasImage ? (
                                    <img
                                        src={imageUrl}
                                        alt="Generated"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-gray-400">{ResultText[language].noImage}</span>
                                )}
                            </div>
                            {hasVideo && (
                                <div className="w-full aspect-video bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center">
                                    <video src={videoUrl} controls className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-col gap-6">

                            {/* Download */}
                            <div className="flex flex-col gap-4 bg-white/5 rounded-2xl border border-white/10 p-6">
                                <h3 className="text-base font-semibold text-white">{ResultText[language].downloads}</h3>
                                <GhostButton
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium bg-violet-500 hover:bg-violet-600 text-white transition disabled:opacity-40 disabled:pointer-events-none"
                                    disabled={!hasImage}
                                    onClick={() => hasImage && download(imageUrl!, 'image.png')}
                                >
                                    {ResultText[language].downloadImage}
                                </GhostButton>
                                <GhostButton
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium bg-violet-500 hover:bg-violet-600 text-white transition disabled:opacity-40 disabled:pointer-events-none"
                                    disabled={!hasVideo}
                                    onClick={() => hasVideo && download(videoUrl!, 'video.mp4')}
                                >
                                    {ResultText[language].downloadVideo}
                                </GhostButton>
                            </div>

                            {/* Video Magic */}
                            <div className="flex flex-col gap-4 bg-white/5 rounded-2xl border border-white/10 p-6">
                                <h3 className="text-base font-semibold text-white">{ResultText[language].videoMagic}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {ResultText[language].videoMagicDesc}
                                </p>
                                {!hasVideo ? (
                                    <PrimaryButton
                                        disabled={!hasImage || isGenerating}
                                        onClick={async () => {
                                            if (!hasImage || isGenerating) return;
                                            setIsGenerating(true);
                                            try {
                                                await generateVideo(project.id);
                                                window.location.reload();
                                            } catch (e) {
                                                // Optionally show error toast
                                            } finally {
                                                setIsGenerating(false);
                                            }
                                        }}
                                    >
                                        {isGenerating ? (
                                            <span className="flex items-center gap-2 justify-center">
                                                <Loader2Icon className="w-5 h-5 animate-spin" />
                                                {ResultText[language].generating}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2 justify-center">
                                                <WandSparkles className="w-5 h-5 mr-2" />
                                                {ResultText[language].generate}
                                            </span>
                                        )}
                                    </PrimaryButton>
                                ) : (
                                    <div className="heading-color font-semibold text-center text-sm">
                                        {ResultText[language].congratulations}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}