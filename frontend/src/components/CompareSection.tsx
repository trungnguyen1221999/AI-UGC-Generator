import { ArrowRightIcon, CheckCircle2Icon, CircleXIcon } from 'lucide-react';
import { compareSectionData } from '../../public/assets/data';
import { PrimaryButton } from './Buttons';
import { Link } from 'react-router-dom';

export default function CompareSection() {
    return (
        <section id="compare" className="mt-15">
            <div className="app-container">
                <div className="relative grid grid-cols-1 lg:grid-cols-2 items-stretch md:gap-15">

                   

                    {/* Arrow desktop — absolute center overlay */}
                    <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <img
                            src={compareSectionData.arrowImage}
                            alt="Manual to AI"
                            className="w-24 xl:w-60 object-contain drop-shadow-2xl"
                        />
                    </div>

                    {/* LEFT panel */}
                    <div className="rounded-2xl border border-red-400/25 bg-linear-to-br from-red-500/15 via-red-500/5 to-transparent p-6 md:p-8">
                        <div className="mb-6">
                            <img
                                src={compareSectionData.manualImage}
                                alt="Manual production workflow"
                                className="w-full aspect-[16/9] object-cover rounded-[11px]"
                            />
                        </div>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
                            Go from <span className='text-red-400'>manual </span>editing...
                        </h3>
                        <ul className="space-y-4">
                            {compareSectionData.manualItems.map((item) => (
                                <li key={item.text} className="flex items-start justify-between gap-4 border-b border-white/8 pb-3">
                                    <div className="flex items-start gap-2">
                                        <CircleXIcon className="size-6 mt-1 text-red-400 shrink-0" />
                                        <span className="text-sm sm:text-base md:text-lg text-gray-200">{item.text}</span>
                                    </div>
                                    <span className="text-sm sm:text-base md:text-lg font-semibold text-red-300 whitespace-nowrap">{item.price}</span>
                                </li>
                            ))}
                            <li className="flex items-start justify-between gap-4 mt-10 text-2xl py-3 sm:py-4">
                                Price + headaches + delays
                                <span className="text-2xl font-semibold text-red-300 whitespace-nowrap">€12,000+</span>
                            </li>
                        </ul>
                    </div>
                     {/* Arrow mobile — between panels */}
                    <div className="lg:hidden flex justify-center my-2 pointer-events-none">
                        <img
                            src={compareSectionData.arrowImage}
                            alt="Manual to AI"
                            className="w-35 object-contain drop-shadow-2xl rotate-90"
                        />
                    </div>

                    {/* RIGHT panel */}
                    <div className="rounded-2xl border border-violet-400/25 bg-linear-to-br from-violet-500/15 via-violet-500/5 to-transparent p-6 md:p-8 flex flex-col">
                        <div className="mb-6">
                            <img
                                src={compareSectionData.aiImage}
                                alt="AI video production workflow"
                                className="w-full aspect-[16/9] object-cover rounded-[11px]"
                            />
                        </div>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
                            ...to <span className='heading-color'>AI</span> production
                        </h3>
                        <ul className="space-y-4 mb-8">
                            {compareSectionData.aiItems.map((item) => (
                                <li key={item} className="flex items-start gap-2 border-b border-white/8 pb-3">
                                    <CheckCircle2Icon className="size-6 mt-1 text-violet-300 shrink-0" />
                                    <span className="text-sm sm:text-base md:text-lg text-gray-100">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Link to="/" className="mt-auto w-full lg:w-fit flex justify-center lg:justify-start">
                        <PrimaryButton className="text-sm sm:text-base md:text-lg py-3 sm:py-4 px-8 sm:px-10">
                            {compareSectionData.ctaText}
                            <ArrowRightIcon className="size-5" />
                        </PrimaryButton>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}