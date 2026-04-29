
import { UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { dashboardMenu, sidebarText } from "../../public/assets/data";
import * as Icons from "lucide-react";
import { Zap } from "lucide-react";

export default function UserMenu({ credits }: { credits?: number | null }) {
  const navigate = useNavigate();
  const language = (window.localStorage.getItem('language') || 'en') as 'en' | 'fi';
  return (
    <UserButton>
      <UserButton.MenuItems>
        {/* Credits as a non-clickable action at the top */}
        <UserButton.Action
          label={`Credits${typeof credits === 'number' ? `: ${credits}` : ''}`}
          labelIcon={<Zap size={14} />}
          onClick={() => {}}
          disabled
        />
        {dashboardMenu.map(item => {
          const Icon = Icons[item.icon];
          // Defensive: fallback to i18nKey or route if missing
          const label = sidebarText[item.i18nKey]?.[language] || sidebarText[item.i18nKey]?.en || item.i18nKey || item.route;
          return (
            <UserButton.Action
              key={item.route}
              label={label}
              labelIcon={<Icon size={14} />}
              onClick={() => navigate(item.route)}
            />
          );
        })}
        {/* Add extra menu items if needed, e.g. Community */}
        <UserButton.Action
          label={language === 'fi' ? 'Yhteisö' : 'Community'}
          labelIcon={<Icons.Users size={14} />}
          onClick={() => navigate('/community')}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}
