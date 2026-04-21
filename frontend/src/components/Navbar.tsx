import { MenuIcon, XIcon } from 'lucide-react';
import { PrimaryButton } from './Buttons';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { assets } from '../../public/assets/assets';
import { ScrollLock } from '../helpers/scrollLock';
import { navbarData } from '../../public/assets/data';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

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

    const { navLinks, signIn, getStarted } = navbarData;

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
                        {navLinks.map((link: { name: string; href: string }) => (
                            <Link to={link.href} onClick={()=> window.scrollTo(0, 0)} key={link.name} className="hover:text-white transition">
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className='hidden md:flex items-center gap-3'>
                        <button className='text-base font-medium text-gray-200 hover:text-white transition max-sm:hidden'>
                            {signIn}
                        </button>
                        <PrimaryButton className='max-sm:text-xs hidden sm:inline-block'>{getStarted}</PrimaryButton>
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
                {navLinks.map((link) => (
                    <Link key={link.name} to={link.href} onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }}>
                        {link.name}
                    </Link>
                ))}

                <button onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }} className='font-medium text-gray-300 hover:text-white transition'>
                    Sign in
                </button>
                <PrimaryButton onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }}>Get Started</PrimaryButton>

            </div>
        </motion.nav>
    );
};