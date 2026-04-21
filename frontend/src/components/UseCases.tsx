import { motion } from 'framer-motion';
import Title from './Title';
import { useCasesData } from '../../public/assets/data';
import { useLanguage } from '../context/LanguageContext';

export default function UseCases() {
    const { language } = useLanguage();
    return (
        <section className="py-20 2xl:py-32">
            <div className="app-container">
                <Title
                    title={language === 'fi' ? 'Käyttötapaukset' : 'Use Cases'}
                    heading={language === 'fi' ? 'Kenelle? Kaikille, jotka myyvät verkossa.' : "Who's It For? Everyone Who Sells Online."}
                    description={language === 'fi' ? 'Yksinyrittäjistä 8-numeroisiin brändeihin – jos teet mainontaa, CreateUGC säästää aikaa ja kasvattaa ROI:ta.' : "From solopreneurs to 8-figure brands — if you're running ads, CreateUGC saves time and boosts ROI."}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {useCasesData.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: 'spring', stiffness: 200, damping: 60, delay: 0.05 + i * 0.08 }}
                            className="rounded-2xl border border-white/8 p-6 flex flex-col gap-4 hover:border-white/15 hover:-translate-y-1 transition duration-300 bg-white/8"
                        >
                            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-white text-lg md:text-xl mb-2">{item.text[language].title}</h3>
                                <p className="text-gray-400 text-base md:text-lg leading-relaxed">{item.text[language].desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}