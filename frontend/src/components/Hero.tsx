import { ArrowRightIcon } from "lucide-react";
import { PrimaryButton } from "./Buttons";
import { motion } from "framer-motion";
import { assets } from "../../public/assets/assets";
import HeroVideoShowcase from "./HeroVideoShowcase";
import { Link } from "react-router-dom";
import { heroData } from "../../public/assets/data";
import { useLanguage } from "../context/LanguageContext";

export default function Hero() {
  const { language } = useLanguage();
  const data = heroData.text[language] || heroData.text["en"];
  const trustedUserImages = heroData.trustedUserImages;

  const heroVideos = assets.heroVideos;
  const heroEmojis = assets.heroEmojis;
  const trustedBrandLogos = assets.brandLogos;
  const staggerLevel = 3;

  return (
    <>
      <section id="home" className="relative z-10 mt-30 md:mt-40">
        <div className="app-container max-md:w-screen max-md:overflow-hidden pt-10 md:pt-26 flex items-center justify-center">
          <div className="grid grid-cols-1 gap-10 items-center w-full">
            <div className="text-center max-w-6xl mx-auto w-full">
              <motion.a
                href="https://prebuiltui.com/tailwind-templates?ref=pixel-forge"
                className="inline-flex items-center gap-4 mb-8 justify-start"
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 70,
                  mass: 1,
                }}
              >
                <div className="flex -space-x-2">
                  {trustedUserImages.map((src: string, i: number) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Client ${i + 1}`}
                      className="size-9 rounded-full border border-black/50"
                      width={56}
                      height={56}
                    />
                  ))}
                </div>
                <span className="text-sm sm:text-base md:text-lg text-gray-200/90 text-left font-semibold leading-snug">
                  {data.trustedBy}
                </span>
              </motion.a>
              <motion.h1
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 max-w-5xl mx-auto"
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 70,
                  mass: 1,
                  delay: 0.1,
                }}
              >
                {data.headline}
              </motion.h1>
              <motion.div
                className="flex justify-center mb-8"
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 70,
                  mass: 1,
                  delay: 0.3,
                }}
              >
                <PrimaryButton
                  className="text-sm sm:text-base md:text-lg py-3 sm:py-4 px-8 sm:px-10"
                  onClick={() => (window.location.href = "/dashboard/generate")}
                >
                  {data.cta}
                  <ArrowRightIcon className="size-5" />
                </PrimaryButton>
              </motion.div>
            </div>
            <HeroVideoShowcase
              heroVideos={heroVideos}
              heroEmojis={heroEmojis}
              staggerLevel={staggerLevel}
            />
          </div>
        </div>
      </section>

      {/* LOGO MARQUEE */}
      <motion.section
        className="border-y border-white/6 bg-white/1 max-md:mt-10"
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        <div className="app-container">
          <div className="w-full overflow-hidden">
            <div className="flex gap-14 items-center justify-center animate-marquee whitespace-nowrap">
              {trustedBrandLogos.concat(trustedBrandLogos).map((brand, i) => (
                <div
                  key={`${brand.name}-${i}`}
                  className="mx-4 w-28 md:w-36 h-8 md:h-10 shrink-0 flex items-center justify-center rounded-lg bg-white/95 px-2 py-1 shadow-sm"
                >
                  <img
                    src={brand.src}
                    alt={brand.name}
                    className={`object-contain origin-center ${brand.name === "Meta" || brand.name === "OpenAI" ? "w-4/5 h-4/5" : "w-full h-full scale-[1.4]"}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
