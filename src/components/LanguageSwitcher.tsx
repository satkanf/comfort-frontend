// import { useLanguage } from '@/contexts/LanguageContext';
// import { Button } from '@/components/ui/button';

// const LanguageSwitcher = () => {
//   const { language, setLanguage } = useLanguage();

//   return (
//     <div className="flex items-center gap-1 border rounded-md p-1">
//       <Button
//         variant={language === 'uk' ? 'default' : 'ghost'}
//         size="sm"
//         onClick={() => setLanguage('uk')}
//         className="h-7 px-3 text-xs"
//       >
//         УКР
//       </Button>
//       <Button
//         variant={language === 'ru' ? 'default' : 'ghost'}
//         size="sm"
//         onClick={() => setLanguage('ru')}
//         className="h-7 px-3 text-xs"
//       >
//         РУС
//       </Button>
//     </div>
//   );
// };

// export default LanguageSwitcher;
// components/LanguageSwitcher/LanguageSwitcher.tsx
// components/LanguageSwitcher/LanguageSwitcher.tsx
// LanguageSwitcher.jsx
// components/LanguageSwitcher/LanguageSwitcher.tsx
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface LanguageOption {
    code: string;
    name: string;
    flag: string;
}

const languageOptions: LanguageOption[] = [
    { code: 'uk', name: 'УКР', flag: '🇺🇦' },
    { code: 'ru', name: 'РУС', flag: '🇷🇺' }
];

const LanguageSwitcher = () => {
    const { language, changeLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-1 border rounded-md p-1 bg-white">
            {languageOptions.map((lang) => (
                <Button
                    key={lang.code}
                    variant={language === lang.code ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => changeLanguage(lang.code)}
                    className="h-8 px-3 text-xs transition-all duration-200"
                    aria-label={`Switch to ${lang.name}`}
                >
                    <span className="mr-1">{lang.flag}</span>
                    {lang.name}
                </Button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;