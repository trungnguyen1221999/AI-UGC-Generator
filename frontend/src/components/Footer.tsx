import { assets } from '../../public/assets/assets';
import { footerLinks, footerData } from '../../public/assets/data';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {

    const { language } = useLanguage();
    const data = footerData[language] || footerData['en'];

    return (
        <motion.footer className="bg-white/6 border-t border-white/6 pt-10 text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.5 }}
        >
            <div className="app-container">
                <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-white/10">
                    <div>
                        <img src={assets.logo} alt="logo" className="h-8" />
                        <p className="max-w-[410px] mt-6 text-sm leading-relaxed">
                            {data.slogan}
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                        {footerLinks.map((section, index) => (
                            <div key={index}>
                                <h3 className="font-semibold text-base text-white md:mb-5 mb-2">
                                    {section.title[language] || section.title['en']}
                                </h3>
                                <ul className="text-sm space-y-1">
                                    {section.links.map(
                                        (link: { name: { en: string; fi: string }; url: string }, i) => (
                                            <li key={i}>
                                                <Link
                                                    to={link.url}
                                                    className="hover:text-white transition"
                                                >
                                                    {link.name[language] || link.name['en']}
                                                </Link>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="py-4 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} {' '}
                    <Link to={data.author.url}>
                        {data.author.name}
                    </Link>
                    . {data.copyright}
                </p>
            </div>
        </motion.footer>
    );
};