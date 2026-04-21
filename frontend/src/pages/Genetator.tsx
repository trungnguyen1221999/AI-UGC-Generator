import { PrimaryButton } from "../components/Buttons";
import { Loader2Icon, Square, RectangleHorizontal, RectangleVertical } from "lucide-react";
import { useState } from "react";
import Title from "../components/Title";
import UploadZone from "../components/UploadZone";

const ASPECT_RATIOS = [
    { value: "1:1", icon: Square, iconClass: "w-5 h-5" },
    { value: "16:9", icon: RectangleHorizontal, iconClass: "w-6 h-5" },
    { value: "9:16", icon: RectangleVertical, iconClass: "w-5 h-6" },
];

export default function Generator() {
    const [name, setName] = useState("");
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productImage, setProductImage] = useState<File | null>(null);
    const [modelImage, setModelImage] = useState<File | null>(null);
    const [aspectRatio, setAspectRatio] = useState("9:16");
    const [userPrompt, setUserPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'model') => {
        const file = e.target.files?.[0] || null;
        type === 'product' ? setProductImage(file) : setModelImage(file);
    };

    const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const inputClass = "rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-violet-400 transition text-base font-medium";
    const labelClass = "flex flex-col gap-2";
    const labelTextClass = "text-base font-semibold text-white";

    return (
        <div className="min-h-screen py-15 md:py-20 bg-white/2">
            <div className="app-container max-md:w-screen pt-10 md:pt-26 flex items-center justify-center">
                <form onSubmit={handleGenerate} className="w-full shadow-xl p-10">

                    <Title
                        title="Create In-Context Image"
                        description="Upload your model and product images to generate stunning UGC, short-form videos and social media posts"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-25 mt-8 items-center">

                        {/* LEFT — upload zones */}
                        <div className="flex flex-col items-center justify-center gap-6 h-full">
                            <UploadZone
                                label="Product Image"
                                file={productImage}
                                onChange={(e) => handleFileChange(e, 'product')}
                                onClear={() => setProductImage(null)}
                            />
                            <UploadZone
                                label="Model Image"
                                file={modelImage}
                                onChange={(e) => handleFileChange(e, 'model')}
                                onClear={() => setModelImage(null)}
                            />
                        </div>

                        {/* RIGHT — form fields */}
                        <div className="flex flex-col justify-center gap-6">
                            <label className={labelClass}>
                                <span className={labelTextClass}>Project Name</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className={inputClass}
                                    placeholder="Name your project"
                                    required
                                />
                            </label>

                            <label className={labelClass}>
                                <span className={labelTextClass}>Product Name</span>
                                <input
                                    type="text"
                                    value={productName}
                                    onChange={e => setProductName(e.target.value)}
                                    className={inputClass}
                                    placeholder="Enter product name"
                                />
                            </label>

                            <label className={labelClass}>
                                <span className={labelTextClass}>
                                    Product Description <span className="heading-color">(optional)</span>
                                </span>
                                <textarea
                                    value={productDescription}
                                    onChange={e => setProductDescription(e.target.value)}
                                    className={`${inputClass} min-h-[100px]`}
                                    placeholder="Describe your product"
                                />
                            </label>

                            <label className={labelClass}>
                                <span className={labelTextClass}>
                                    User Prompt <span className="heading-color">(optional)</span>
                                </span>
                                <textarea
                                    value={userPrompt}
                                    onChange={e => setUserPrompt(e.target.value)}
                                    className={`${inputClass} min-h-[100px]`}
                                    placeholder="Describe what you want to generate"
                                />
                            </label>

                            <div className={labelClass}>
                                <span className={labelTextClass}>Aspect Ratio</span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                                    {ASPECT_RATIOS.map(({ value, icon: Icon, iconClass }) => (
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
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Generate button */}
                    <div className="flex justify-center mt-10">
                        <PrimaryButton
                            type="submit"
                            className="px-12 py-3 text-base shadow-lg w-full"
                            disabled={isGenerating ? true : undefined}
                        >
                            {isGenerating ? (
                                <span className="flex items-center gap-2">
                                    <Loader2Icon className="animate-spin w-5 h-5" />
                                    Generating
                                </span>
                            ) : 'Generate'}
                        </PrimaryButton>
                    </div>

                </form>
            </div>
        </div>
    );
}