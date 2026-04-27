import DropdownMenu from './DropdownMenu';
import { languages } from '../../public/assets/data';

export default function LanguageDropdown({ language, setLanguage, className = '' }: { language: string, setLanguage: (lang: string) => void, className?: string }) {
  return (
    <DropdownMenu
      className={className}
      title={languages.find(l => l.code === language)?.label || 'Select'}
      options={languages.map(l => l.label)}
      onSelect={label => {
        const lang = languages.find(l => l.label === label)?.code;
        if (lang) setLanguage(lang);
      }}
    />
  );
}
