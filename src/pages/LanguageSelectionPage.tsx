import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/ui'
import { TopAppBar } from '@/components/layout'
import { cn } from '@/utils/cn'

// Mock M32: Language Selection Page
interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
]

export function LanguageSelectionPage() {
  const navigate = useNavigate()
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLanguages = LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (code: string) => {
    setSelectedLanguage(code)
    // Would save preference and update app language
    setTimeout(() => navigate(-1), 300)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <TopAppBar
        showHome
        title="Language" />

      <div className="flex-1 px-4 pb-8">
        {/* Search */}
        <div className="mt-4 relative">
          <Icon
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search languages..."
            className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        {/* Current Language */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Current Language
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm">
            {(() => {
              const current = LANGUAGES.find(
                (l) => l.code === selectedLanguage
              )
              return current ? (
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{current.flag}</span>
                  <div className="flex-1">
                    <p className="font-bold">{current.name}</p>
                    <p className="text-sm text-gray-500">{current.nativeName}</p>
                  </div>
                  <Icon name="check_circle" className="text-primary text-2xl" />
                </div>
              ) : null
            })()}
          </div>
        </section>

        {/* All Languages */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            All Languages
          </h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
            {filteredLanguages.map((language, idx) => (
              <button
                key={language.code}
                onClick={() => handleSelect(language.code)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left',
                  idx !== filteredLanguages.length - 1 &&
                    'border-b border-gray-100 dark:border-gray-800',
                  selectedLanguage === language.code &&
                    'bg-primary/5 dark:bg-primary/10'
                )}
              >
                <span className="text-2xl">{language.flag}</span>
                <div className="flex-1">
                  <p className="font-semibold">{language.name}</p>
                  <p className="text-sm text-gray-500">{language.nativeName}</p>
                </div>
                {selectedLanguage === language.code && (
                  <Icon name="check_circle" className="text-primary text-xl" />
                )}
              </button>
            ))}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="text-center py-12">
              <Icon
                name="translate"
                className="text-5xl text-gray-300 dark:text-gray-600 mb-4"
              />
              <p className="text-gray-500">
                No languages found for "{searchQuery}"
              </p>
            </div>
          )}
        </section>

        {/* Request Language */}
        <div className="mt-6 text-center">
          <button className="text-primary font-medium text-sm hover:underline">
            Request a new language
          </button>
        </div>
      </div>
    </div>
  )
}
