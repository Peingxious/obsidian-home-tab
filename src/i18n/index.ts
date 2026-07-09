import en from './locales/en'
import zh from './locales/zh'

export type Lang = 'en' | 'zh'
export type LocaleKey = keyof typeof en
type Params = Record<string, string | number>

const locales: Record<Lang, Record<LocaleKey, string>> = { en, zh }

/**
 * Detect the user's language. Obsidian stores its UI language in
 * `localStorage['language']`; fall back to the browser's `navigator.language`.
 * Chinese (any regional variant, e.g. `zh-CN`) maps to the `zh` locale.
 */
function detectLanguage(): Lang {
	const stored = (window.localStorage?.getItem('language') ?? '').toLowerCase()
	const browser = (navigator.language ?? 'en').toLowerCase()
	const code = stored || browser
	return code.startsWith('zh') ? 'zh' : 'en'
}

let currentLang: Lang = detectLanguage()

/** Override the active locale (e.g. from a future settings option). */
export function setLanguage(lang: Lang): void {
	currentLang = lang
}

export function getLanguage(): Lang {
	return currentLang
}

/**
 * Translate a key. Falls back to English, then to the key itself, so the UI
 * never shows an empty string. Pass `params` for `{placeholder}` interpolation.
 */
export function t(key: LocaleKey, params?: Params): string {
	let str = locales[currentLang][key] ?? en[key] ?? (key as string)
	if (params) {
		for (const [name, value] of Object.entries(params)) {
			str = str.replace(new RegExp(`\\{${name}\\}`, 'g'), String(value))
		}
	}
	return str
}
