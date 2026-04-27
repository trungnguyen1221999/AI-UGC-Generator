import { PrimaryButton , GhostButton } from "../components/Buttons";
import { Square, RectangleHorizontal, RectangleVertical, WandSparkles, Loader2Icon } from "lucide-react";
import { useState } from "react";
import Title from "../components/Title";
import UploadZone from "../components/UploadZone";
import { genetatorText } from "../../public/assets/data";
import { useLanguage } from "../context/LanguageContext";
import { useUser, useClerk } from '@clerk/clerk-react';
import { createProject } from '../axios/projectApi/projectApi';
import { useNavigate } from 'react-router-dom';



export default function Generator() {
    const [isGenerating, setIsGenerating] = useState(false);
    const { language } = useLanguage();
    const t = genetatorText[language] || genetatorText['en'];
    const [name, setName] = useState("");
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productImage, setProductImage] = useState<File | null>(null);
    const [modelImage, setModelImage] = useState<File | null>(null);
    const [aspectRatio, setAspectRatio] = useState("9:16");
    const [userPrompt, setUserPrompt] = useState("");
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'model') => {
        const file = e.target.files?.[0] || null;
        type === 'product' ? setProductImage(file) : setModelImage(file);
    };

    const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('productName', productName);
            formData.append('productDescription', productDescription);
            formData.append('aspectRatio', aspectRatio);
            formData.append('userPrompt', userPrompt);
            if (productImage) formData.append('images', productImage);
            if (modelImage) formData.append('images', modelImage);
            const res = await createProject(formData);
            const projectId = res?.data?.project?.id;
            if (projectId) {
                navigate(`/result/${projectId}`);
            }
        } catch (error) {
            // Optionally show error toast
        } finally {
            setIsGenerating(false);
        }
    };

    const inputClass = "rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-violet-400 transition text-base font-medium";
    const labelClass = "flex flex-col gap-2";
    const labelTextClass = "text-base font-semibold text-white";

    const { user, isSignedIn } = useUser();
    const { openSignIn, openSignUp } = useClerk();

    if (!isSignedIn) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Title
                    title={t.signInTitle || "Sign In Required"}
                    description={t.signInDescription || "Please sign in to continue using the generator."}
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
                <form onSubmit={handleGenerate} className="w-full shadow-xl">

                    <Title
                        title={t.title}
                        description={t.description}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-25 mt-8 items-center">

                        {/* LEFT — upload zones */}
                        <div className="flex flex-col items-center justify-center gap-6 h-full">
                            <UploadZone
                                label={t.productImage}
                                file={productImage}
                                onChange={(e) => handleFileChange(e, 'product')}
                                onClear={() => setProductImage(null)}
                            />
                            <UploadZone
                                label={t.modelImage}
                                file={modelImage}
                                onChange={(e) => handleFileChange(e, 'model')}
                                onClear={() => setModelImage(null)}
                            />
                        </div>

                        {/* RIGHT — form fields */}
                        <div className="flex flex-col justify-center gap-6">
                            <label className={labelClass}>
                                <span className={labelTextClass}>{t.projectName}</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className={inputClass}
                                    placeholder={t.projectNamePlaceholder}
                                    required
                                />
                            </label>

                            <label className={labelClass}>
                                <span className={labelTextClass}>{t.productName}</span>
                                <input
                                    type="text"
                                    value={productName}
                                    onChange={e => setProductName(e.target.value)}
                                    className={inputClass}
                                    placeholder={t.productNamePlaceholder}
                                />
                            </label>

                            <label className={labelClass}>
                                <span className={labelTextClass}>{t.productDescription} <span className="heading-color">(optional)</span></span>
                                <textarea
                                    value={productDescription}
                                    onChange={e => setProductDescription(e.target.value)}
                                    className={`${inputClass} min-h-[100px]`}
                                    placeholder={t.productDescriptionPlaceholder}
                                />
                            </label>

                            <label className={labelClass}>
                                <span className={labelTextClass}>{t.userPrompt} <span className="heading-color">(optional)</span></span>
                                <textarea
                                    value={userPrompt}
                                    onChange={e => setUserPrompt(e.target.value)}
                                    className={`${inputClass} min-h-[100px]`}
                                    placeholder={t.userPromptPlaceholder}
                                />
                            </label>

                            <div className={labelClass}>
                                <span className={labelTextClass}>{t.aspectRatio}</span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                                    {t.aspectRatioOptions.map(({ value, label }) => {
                                        let Icon = Square;
                                        let iconClass = "w-5 h-5";
                                        if (value === "16:9") { Icon = RectangleHorizontal; iconClass = "w-6 h-5"; }
                                        if (value === "9:16") { Icon = RectangleVertical; iconClass = "w-5 h-6"; }
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setAspectRatio(value)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition font-medium text-sm ${
                                                    aspectRatio === value
                                                        ? "bg-violet-500/20 border-violet-400 text-violet-300"
                                                        : "bg-white/10 border-white/10 text-white hover:bg-violet-900/10"
                                                }`}
                                            >
                                                <Icon className={iconClass} />
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Generate button */}
                    <div className={`flex justify-center mt-10${isGenerating ? ' cursor-not-allowed' : ''}`}>
                        <PrimaryButton
                            type="submit"
                            className="px-12 py-3 text-base shadow-lg w-full"
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <span className="flex items-center gap-2 justify-center">
                                    <Loader2Icon className="w-5 h-5 animate-spin" />
                                    {t.generating}
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 justify-center">
                                    <WandSparkles className="w-5 h-5" />
                                    {t.generate}
                                </span>
                            )}
                        </PrimaryButton>
                    </div>

                </form>
            </div>
        </div>
    );
}