import { MenuIcon, XIcon } from 'lucide-react';
import { PrimaryButton } from './Buttons';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { assets } from '../../public/assets/assets';
import { ScrollLock } from '../helpers/scrollLock';
import { navbarData } from '../../public/assets/data';
import DropdownMenu from './DropdownMenu';
import { languages } from '../../public/assets/data';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage } = useLanguage();

    useEffect(() => {
        if (isOpen) {
            ScrollLock.preventScrolling();
        } else {
            ScrollLock.restoreScrolling();
        }

        return () => {
            ScrollLock.restoreScrolling();
        };
    }, [isOpen]);

        // Custom navLinks: Pricing scrolls to #pricing on homepage
        const navLinks = navbarData.navLinks.map(link =>
            link.href === '/pricing'
                ? { ...link, onClick: (e: any) => {
                        e.preventDefault();
                        window.location.pathname === '/'
                            ? document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                            : window.location.assign('/#pricing');
                    }}
                : link
        );
    const signIn = navbarData.signIn[language] || navbarData.signIn['en'];
    const getStarted = navbarData.getStarted[language] || navbarData.getStarted['en'];

    return (
        <motion.nav className='fixed top-5 left-0 right-0 z-50'
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
        >
            <div className='app-container'>
                <div className='w-full flex items-center justify-between p-4 md:px-2 md:py-3'>
                    <Link to='/' onClick={()=> window.scrollTo(0, 0)}>
                        <img src={assets.logo} alt="logo" className="h-9 md:h-10" />
                    </Link>

                    <div className='hidden md:flex items-center gap-10 text-base font-medium text-gray-200 bg-white/10 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl px-8 py-3'>
                        {navLinks.map((link: { href: string; text: { en: string; fi: string }, onClick?: (e: any) => void }) => (
                            <Link
                                to={link.href}
                                onClick={link.onClick ? link.onClick : ()=> window.scrollTo(0, 0)}
                                key={link.href}
                                className="hover:text-white transition"
                            >
                                {link.text[language] || link.text['en']}
                            </Link>
                        ))}
                    </div>

                    <div className='hidden md:flex items-center gap-3'>
                        <button className='text-base font-medium text-gray-200 hover:text-white transition max-sm:hidden'>
                            {signIn}
                        </button>
                        <PrimaryButton className='max-sm:text-xs hidden sm:inline-block'>{getStarted}</PrimaryButton>
                        <DropdownMenu
                            title={languages.find(l => l.code === language)?.label || 'Select'}
                            options={languages.map(l => l.label)}
                            onSelect={label => {
                                const lang = languages.find(l => l.label === label)?.code;
                                if (lang) setLanguage(lang as any);
                            }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className='md:hidden'
                        aria-label="Open menu"
                        title="Open menu"
                    >
                        <MenuIcon className='size-6' />
                    </button>
                </div>
            </div>
            <div className={`flex flex-col items-center justify-center gap-6 text-lg font-medium fixed inset-0 bg-black/40 backdrop-blur-md z-50 transition-all duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 rounded-md bg-white p-2 text-gray-800 ring-white active:ring-2"
                    aria-label="Close menu"
                    title="Close menu"
                >
                    <XIcon />
                </button>
                {navLinks.map((link: { href: string; text: { en: string; fi: string }, onClick?: (e: any) => void }) => (
                    <Link
                        key={link.href}
                        to={link.href}
                        onClick={e => {
                            setIsOpen(false);
                            if (link.onClick) link.onClick(e);
                            else window.scrollTo(0, 0);
                        }}
                    >
                        {link.text[language] || link.text['en']}
                    </Link>
                ))}

                <button onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }} className='font-medium text-gray-300 hover:text-white transition'>
                    {signIn}
                </button>
                <PrimaryButton onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }}>{getStarted}</PrimaryButton>
                 <DropdownMenu
                            title={languages.find(l => l.code === language)?.label || 'Select'}
                            options={languages.map(l => l.label)}
                            onSelect={label => {
                                const lang = languages.find(l => l.label === label)?.code;
                                if (lang) setLanguage(lang as any);
                            }}
                        />
            </div>
        </motion.nav>
    );
};