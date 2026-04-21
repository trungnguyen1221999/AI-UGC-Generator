import { Check } from 'lucide-react';
import { PrimaryButton, GhostButton } from './Buttons';
import Title from './Title';
import { plansData } from '../../public/assets/data';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Pricing() {
    const { language } = useLanguage();
    const refs = useRef<(HTMLDivElement | null)[]>([]);
    return (
        <section id="pricing" className="py-20 bg-white/3 border-t border-white/6">
            <div className="app-container">

                <Title
                    title={language === 'fi' ? 'Hinnoittelu' : 'Pricing'}
                    heading={language === 'fi' ? 'Yksinkertainen, läpinäkyvä hinnoittelu' : 'Simple, transparent pricing'}
                    description={language === 'fi' ? 'Joustavat paketit startupeille, kasvaville tiimeille ja vakiintuneille brändeille.' : 'Flexible agency packages designed to fit startups, growing teams and established brands.'}
                />

                <div className="grid md:grid-cols-3 gap-6">
                    {plansData.map((plan, i) => (
                        <motion.div
                            key={i}

                            ref={(el) => {
                                refs.current[i] = el;
                            }}
                            initial={{ y: 150, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 + i * 0.1 }}
                            onAnimationComplete={() => {
                                const card = refs.current[i];
                                if (card) {
                                    card.classList.add("transition", "duration-500", "hover:scale-102");
                                }
                            }}
                            className={`relative p-6 rounded-xl border backdrop-blur ${plan.popular
                                ? 'border-indigo-500/50 bg-indigo-900/30'
                                : 'border-white/8 bg-indigo-950/30'
                                }`}
                        >
                            {plan.popular && (
                                <p className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 rounded-md text-xs">
                                    {language === 'fi' ? 'Suosituin' : 'Most popular'}
                                </p>
                            )}

                            <div className="mb-6">
                                <p className="font-semibold text-lg md:text-xl text-white">{plan.text[language].name}</p>
                                <div className="flex items-end gap-3">
                                    <span className="text-4xl md:text-5xl font-extrabold text-white">{plan.price}</span>
                                    <span className="text-base md:text-lg text-gray-400">
                                        / {plan.credits}
                                    </span>
                                </div>
                                <p className="text-base md:text-lg text-gray-300 mt-2">
                                    {plan.text[language].desc}
                                </p>
                            </div>

                            <ul className="space-y-2 mb-8">
                                {plan.text[language].features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-gray-200 text-base md:text-lg">
                                        <Check className="w-4 h-4 text-green-400" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <PrimaryButton className="w-full">{language === 'fi' ? 'Aloita' : 'Get Started'}</PrimaryButton>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};