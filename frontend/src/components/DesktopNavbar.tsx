import { Link } from 'react-router-dom';
import { navbarData, languages } from '../../public/assets/data';
import { PrimaryButton } from './Buttons';
import DropdownMenu from './DropdownMenu';
import UserMenu from './UserMenu';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useLanguage } from '../context/LanguageContext';

export default function DesktopNavbar({ credits, signIn, getStarted, setLanguage, language }: any) {
  const { user } = useUser();
  return (
    <>
      <div className='hidden md:flex items-center gap-10 text-base font-medium text-gray-200 bg-white/10 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl px-8 py-3'>
        {navbarData.navLinks.map(item => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => window.scrollTo(0, 0)}
            className="dashboard-menu-link"
          >
            {item.text[language]}
          </Link>
        ))}
      </div>
      <div className='hidden md:flex items-center gap-3'>
        {!user ? (
          <>
            <button
              onClick={() => useClerk().openSignIn()}
              className='text-base font-medium text-gray-200 hover:text-white transition'
            >
              {signIn}
            </button>
            <PrimaryButton onClick={() => useClerk().openSignUp()} className='hidden sm:inline-block'>
              {getStarted}
            </PrimaryButton>
          </>
        ) : (
          <div className='flex items-center gap-3'>
            <UserMenu credits={credits} />
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
    </>
  );
}
