import { ArrowRightIcon } from 'lucide-react';
import { PrimaryButton } from './Buttons';
import { motion } from 'framer-motion';
import { assets } from '../../public/assets/assets';
import HeroVideoShowcase from './HeroVideoShowcase';

export default function Hero() {

    const trustedUserImages = [
        'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=50',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop'
    ];

    const heroVideos = assets.heroVideos;
    const heroEmojis = assets.heroEmojis;
    const trustedBrandLogos = assets.brandLogos;
    const staggerLevel = 3;

    return (
        <>
            <section id="home" className="relative z-10 mt-20 md:mt-15">
                <div className="app-container max-md:w-screen max-md:overflow-hidden pt-10 md:pt-26 flex items-center justify-center">
                    <div className="grid grid-cols-1 gap-10 items-center w-full">
                        <div className="text-center max-w-6xl mx-auto w-full">
                            <motion.a href="https://prebuiltui.com/tailwind-templates?ref=pixel-forge" className="inline-flex items-center gap-4 mb-8 justify-start"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
                            >
                                <div className="flex -space-x-2">
                                    {trustedUserImages.map((src, i) => (
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
                                    Trusted by over 85,000+ customers
                                </span>
                            </motion.a>

                            <motion.h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 max-w-5xl mx-auto"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 }}
                            >
                                Turn any product into <br />
                                <span className="heading-color">
                                    a scroll-stopping AI UGC ad
                                </span>
                            </motion.h1>

                            <motion.p className="text-gray-300 text-base sm:text-lg md:text-xl mx-auto mb-8"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                            >
                                Launch scroll-stopping UGC-style ads for your product with our AI UGC video generator.
                                They look real, follow your script, and can convert up to 5.7x more in under 60 seconds.
                            </motion.p>

                            <motion.div className="flex justify-center mb-8"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.3 }}
                            >
                                <a href="/" className="w-auto">
                                    <PrimaryButton className="text-sm sm:text-base md:text-lg py-3 sm:py-4 px-8 sm:px-10">
                                        Get Your First Video Now
                                        <ArrowRightIcon className="size-5" />
                                    </PrimaryButton>
                                </a>
                            </motion.div>
                        </div>

                        <HeroVideoShowcase heroVideos={heroVideos} heroEmojis={heroEmojis} staggerLevel={staggerLevel} />
                    </div>
                </div>
            </section>

            {/* LOGO MARQUEE */}
            <motion.section className="border-y border-white/6 bg-white/1 max-md:mt-10"
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
                                        className={`object-contain origin-center ${(brand.name === 'Meta'|| brand.name === 'OpenAI') ? 'w-4/5 h-4/5' : 'w-full h-full scale-[1.4]'}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>
        </>
    );
};