import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { dashboardMenu, sidebarText } from '../../public/assets/data';
import * as Icons from 'lucide-react';
import UserMenu from './UserMenu';
import CreditsPill from './CreditsPill';
import LanguageDropdown from './LanguageDropdown';
import Logo from './Logo';
import { useUser } from '@clerk/clerk-react';
import {PrimaryButton} from './Buttons';

export default function Sidebar({ user, credits }: { user: any, credits: number | null }) {
  const { language, setLanguage } = useLanguage();
  
  const navigate = useNavigate();
  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-white/5 bg-gray-950 fixed inset-y-0 left-0 z-30 py-6 px-4">
      <div className="mb-8 px-2"><Logo /></div>
      {user && (
        <div className="flex items-center gap-3 p-3 mb-6 bg-white/5 rounded-2xl border border-white/5">
          <UserMenu />
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">{user.firstName}</p>
            <p className="text-[10px] text-white/40 truncate">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      )}
      <PrimaryButton
        onClick={() => navigate('/dashboard/generate')}
      >
        <Icons.Plus className="w-4 h-4" />
        {sidebarText.newProject[language]}
      </PrimaryButton>
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {dashboardMenu.map(item => {
          const Icon = Icons[item.icon];
          return (
            <a
              key={item.route}
              href={item.route}
              className="dashboard-menu-link"
              onClick={() => navigate(item.route)}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{sidebarText[item.i18nKey][language]}</span>
            </a>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 flex flex-col gap-4">
        <LanguageDropdown language={language} setLanguage={setLanguage} className="w-full" />
        <CreditsPill credits={credits} />
      </div>
    </aside>
  );
}
