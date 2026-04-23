import { Check } from 'lucide-react';
import { PrimaryButton, GhostButton } from './Buttons';
import Title from './Title';
import { plansData } from '../../public/assets/data';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {PricingTable} from "@clerk/react"

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

                <div className="flex flex-wrap items-center justify-center mx-auto gap-6">
                    <PricingTable appearance = {
                        {
                            variable: {
                                colorBackground: 'none',
                            },
                            element: {
                                pricingTableCardBody : 'bg-white/6',
                                pricingTableCardHeader : 'bg-white/10',
                                switchThumb: 'bg-white'
                            }
                        }
                    } />
                </div>
            </div>
        </section>
    );
};