import { MenuIcon, XIcon, SparklesIcon, FolderEditIcon, HomeIcon, UsersIcon, DollarSignIcon } from 'lucide-react';
import { PrimaryButton, GhostButton } from './Buttons';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";
import { getUserCredit } from '../axios/userApi/userApi';

import { assets } from '../../public/assets/assets';
import { ScrollLock } from '../helpers/scrollLock';
import { navbarData, languages } from '../../public/assets/data';
import DropdownMenu from './DropdownMenu';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage } = useLanguage();
    const { user } = useUser();
    console.log('Clerk user in Navbar:', user);
    const { openSignIn, openSignUp } = useClerk();
    const [credits, setCredits] = useState<number | null>(null);

    useEffect(() => {
        if (user) {
            getUserCredit()
                .then(res => setCredits(res.data.credits))
                .catch(() => setCredits(null));
        } else {
            setCredits(null);
        }
    }, [user]);

    useEffect(() => {
        if (isOpen) ScrollLock.preventScrolling();
        else ScrollLock.restoreScrolling();
        return () => ScrollLock.restoreScrolling();
    }, [isOpen]);

    const navTo = (path: string) => {
        navigate(path);
        window.scrollTo(0, 0);
    };

    const navLinks = navbarData.navLinks.map(link =>
        link.href === '/pricing'
            ? {
                ...link,
                onClick: (e: any) => {
                    e.preventDefault();
                    location.pathname === '/'
                        ? document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                        : navigate('/#pricing');
                }
            }
            : link
    );

    const signIn = navbarData.signIn[language] || navbarData.signIn['en'];
    const getStarted = navbarData.getStarted[language] || navbarData.getStarted['en'];

    const UserMenu = () => (
        <UserButton>
            <UserButton.MenuItems>
                <UserButton.Action
                    label="Generate"
                    labelIcon={<SparklesIcon size={14} />}
                    onClick={() => navTo('/generate')}
                />
                <UserButton.Action
                    label="My Generations"
                    labelIcon={<FolderEditIcon size={14} />}
                    onClick={() => navTo('/my-generations')}
                />
                <UserButton.Action
                    label="Home"
                    labelIcon={<HomeIcon size={14} />}
                    onClick={() => navTo('/')}
                />
                <UserButton.Action
                    label="Community"
                    labelIcon={<UsersIcon size={14} />}
                    onClick={() => navTo('/community')}
                />
                <UserButton.Action
                    label="Plans"
                    labelIcon={<DollarSignIcon size={14} />}
                    onClick={() => navTo('/plan')}
                />
            </UserButton.MenuItems>
        </UserButton>
    );

    return (
        <motion.nav
            className='fixed top-5 left-0 right-0 z-50'
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
        >
            <div className='app-container'>
                <div className='w-full flex items-center justify-between p-4 md:px-2 md:py-3'>

                    <Link to='/' onClick={() => window.scrollTo(0, 0)}>
                        <img src={assets.logo} alt="logo" className="h-9 md:h-10" />
                    </Link>

                    {/* Desktop nav */}
                    <div className='hidden md:flex items-center gap-10 text-base font-medium text-gray-200 bg-white/10 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl px-8 py-3'>
                        {navLinks.map((link: { href: string; text: { en: string; fi: string }; onClick?: (e: any) => void }) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={link.onClick ?? (() => window.scrollTo(0, 0))}
                                className="hover:text-white transition"
                            >
                                {link.text[language] || link.text['en']}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop right */}
                    <div className='hidden md:flex items-center gap-3'>
                        {!user ? (
                            <>
                                <button
                                    onClick={() => openSignIn()}
                                    className='text-base font-medium text-gray-200 hover:text-white transition'
                                >
                                    {signIn}
                                </button>
                                <PrimaryButton onClick={() => openSignUp()} className='hidden sm:inline-block'>
                                    {getStarted}
                                </PrimaryButton>
                            </>
                        ) : (
                            <div className='flex items-center gap-3'>
                                <div className='px-4 py-2 rounded-full bg-gray-800 text-white font-semibold flex items-center gap-2'>
                                    Credits  {' ' + (credits !== null ? credits : '')} 
                                </div>
                                <UserMenu />
                            </div>
                        )}
                        <DropdownMenu
                            title={languages.find(l => l.code === language)?.label || 'Select'}
                            options={languages.map(l => l.label)}
                            onSelect={label => {
                                const lang = languages.find(l => l.label === label)?.code;
                                if (lang) setLanguage(lang as any);
                            }}
                        />
                    </div>

                    {/* Mobile right */}
                    <div className='flex md:hidden items-center gap-3'>
                        {!user ? (
                            <button
                                type="button"
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label="Open menu"
                            >
                                <MenuIcon className='size-6' />
                            </button>
                        ) : (
                            <div className='flex items-center gap-2'>
                                <DropdownMenu
                                    title={languages.find(l => l.code === language)?.label || 'Select'}
                                    options={languages.map(l => l.label)}
                                    onSelect={label => {
                                        const lang = languages.find(l => l.label === label)?.code;
                                        if (lang) setLanguage(lang as any);
                                    }}
                                />
                                <UserMenu />
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Mobile menu — chỉ hiện khi chưa login */}
            {!user && (
                <div className={`flex flex-col items-center justify-center gap-6 text-lg font-medium fixed inset-0 bg-black/40 backdrop-blur-md z-50 transition-all duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 rounded-md bg-white p-2 text-gray-800 ring-white active:ring-2"
                        aria-label="Close menu"
                    >
                        <XIcon />
                    </button>

                    {navLinks.map((link: { href: string; text: { en: string; fi: string }; onClick?: (e: any) => void }) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            onClick={e => {
                                setIsOpen(false);
                                window.scrollTo(0, 0);
                                if (link.onClick) link.onClick(e);
                            }}
                        >
                            {link.text[language] || link.text['en']}
                        </Link>
                    ))}

                    <button
                        onClick={() => { setIsOpen(false); openSignIn(); }}
                        className='font-medium text-gray-300 hover:text-white transition'
                    >
                        {signIn}
                    </button>

                    <PrimaryButton onClick={() => { setIsOpen(false); openSignUp(); }}>
                        {getStarted}
                    </PrimaryButton>

                    <DropdownMenu
                        title={languages.find(l => l.code === language)?.label || 'Select'}
                        options={languages.map(l => l.label)}
                        onSelect={label => {
                            const lang = languages.find(l => l.label === label)?.code;
                            if (lang) setLanguage(lang as any);
                        }}
                    />
                </div>
            )}
        </motion.nav>
    );
}