import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { ResultText } from "../../public/assets/data";
import { HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
    const { language } = useLanguage();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white/2 relative overflow-hidden">

            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />
            </div>

            {/* 404 number */}
            <div className="relative select-none">
                <span className="text-[160px] md:text-[220px] font-black text-white/5 leading-none tracking-tighter">
                    404
                </span>
                <span className="absolute inset-0 flex items-center justify-center text-[160px] md:text-[220px] font-black leading-none tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-violet-300 to-violet-500/30">
                    404
                </span>
            </div>

            {/* Text */}
            <div className="flex flex-col items-center gap-3 -mt-6 z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {ResultText[language]?.notFoundTitle || "Page Not Found"}
                </h2>
                <p className="text-gray-400 text-center max-w-sm text-sm md:text-base leading-relaxed px-6">
                    {ResultText[language]?.notFoundDesc || "Sorry, the page you are looking for does not exist or has been moved."}
                </p>
            </div>

            {/* CTA */}
            <Link
                to="/"
                className="mt-10 z-10 flex items-center gap-2 px-6 py-3 rounded-full bg-violet-500 hover:bg-violet-600 text-white font-semibold transition shadow-lg shadow-violet-500/25"
            >
                <HomeIcon className="w-4 h-4" />
                {ResultText[language]?.goHome || "Go Home"}
            </Link>

        </div>
    );
}