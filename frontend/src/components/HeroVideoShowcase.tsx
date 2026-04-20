import { motion } from 'framer-motion';
import { getVideoStaggerClass } from '../helpers/videoStagger';

type HeroVideoShowcaseProps = {
    heroVideos: string[];
    heroEmojis: string[];
    staggerLevel: number;
};

export default function HeroVideoShowcase({ heroVideos, heroEmojis, staggerLevel }: HeroVideoShowcaseProps) {
    return (
        <motion.div
            className="mx-auto w-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 250, damping: 70, mass: 1, delay: 0.5 }}
        >
            <div className="relative">
                <div className="video-fade-mask">
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 items-start pb-8 md:pb-12">
                        {heroVideos.map((videoSrc, i) => (
                            <motion.div
                                key={videoSrc}
                                className={`rounded-2xl overflow-hidden border border-white/8 shadow-xl bg-gray-900 ${
                                    i >= 3 ? 'hidden md:block' : 'block'
                                } ${getVideoStaggerClass(i, staggerLevel)}`}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06 }}
                            >
                                <video
                                    src={videoSrc}
                                    className="w-full h-full aspect-9/16 object-cover object-center"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="pointer-events-none absolute inset-0 z-30">
                    <motion.img
                        src={heroEmojis[2]}
                        alt="Hero emoji 1"
                        className="absolute left-0 top-0 w-210 drop-shadow-2xl"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.35 }}
                    />
                    <motion.img
                        src={heroEmojis[1]}
                        alt="Hero emoji 2"
                        className="absolute right-0 bottom-0 w-300 drop-shadow-2xl"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.42 }}
                    />
                    <motion.img
                        src={heroEmojis[0]}
                        alt="Hero emoji 3"
                        className="absolute left-0 bottom-0 w-500 drop-shadow-2xl"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
