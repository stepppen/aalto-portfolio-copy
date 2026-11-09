import { ui, type UiKey } from '~/i18n/ui'

export type Lang = 'en' | 'de'

/** Strip or add the /de prefix. English lives at the root, German under /de. */
export const stripLang = (path: string) => path.replace(/^\/de(?=\/|$)/, '') || '/'
export const withLang = (path: string, lang: Lang) => (lang === 'de' ? (path === '/' ? '/de' : `/de${path}`) : path)

/**
 * Language from the URL, plus helpers:
 * t(key) for interface strings, lp(path) for internal links, col(name) for the content collection.
 */
export function useLang() {
  const route = useRoute()
  const lang = computed<Lang>(() => (route.path === '/de' || route.path.startsWith('/de/') ? 'de' : 'en'))
  const t = (key: UiKey) => ui[lang.value][key] ?? ui.en[key]
  const lp = (path: string) => (path.startsWith('/') ? withLang(path, lang.value) : path)
  /** The other language's version of the current page. */
  const other = computed(() => withLang(stripLang(route.path), lang.value === 'de' ? 'en' : 'de'))
  const col = <N extends string>(name: N) => (lang.value === 'de' ? `${name}_de` : name) as N
  return { lang, t, lp, other, col }
}
