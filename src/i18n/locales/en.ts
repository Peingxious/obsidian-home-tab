// English is the default/fallback locale. Every key defined here must also
// exist in every other locale (the other locales are typed against this object,
// so TypeScript will error if a translation is missing).

const en = {
	// Settings — headings
	settings_title: 'Home tab settings',
	settings_general: 'General settings',
	settings_search: 'Search settings',
	settings_filesDisplay: 'Files display',
	settings_appearance: 'Appearance',

	// Settings — general
	settings_replaceNewTabs: 'Replace new tabs with Home tab',
	settings_openOnStart: 'Open new Home tab on Obsidian start',
	settings_openOnStart_desc: "If a Home tab is already open it'll focus it instead of opening a new one.",
	settings_closePreviousOnStart: 'Close previous session tabs on start',
	settings_closePreviousOnStart_desc: 'Enable this to close all the tabs and leave only one Home tab on Obsidian opening.',

	// Settings — search
	settings_useOmnisearch: 'Use Omnisearch',
	settings_useOmnisearch_desc: 'Set Omnisearch as the default search engine.',
	settings_markdownOnly: 'Search only markdown files',
	settings_showUncreated: 'Show uncreated files',
	settings_showPath: 'Show file path',
	settings_showPath_desc: 'Displays file path at the right of the filename.',
	settings_showShortcuts: 'Show shortcuts',
	settings_showShortcuts_desc: 'Displays shortcuts under the search results.',
	settings_searchResults: 'Search results',
	settings_searchResults_desc: 'Set how many results display.',
	settings_searchDelay: 'Search delay',
	settings_searchDelay_desc: 'The value is in milliseconds.',
	settings_showExcerpt: 'Show excerpt (Omnisearch)',
	settings_showExcerpt_desc: 'Shows the contextual part of the note that matches the search.',

	// Settings — files display
	settings_showBookmarks: 'Show bookmarked files',
	settings_showBookmarks_desc: 'Shows bookmarked files under the search bar.',
	settings_showRecent: 'Show recent files',
	settings_showRecent_desc: 'Displays recent files under the search bar.',
	settings_storeRecent: 'Store last recent files',
	settings_storeRecent_desc: 'Remembers the recent files of the previous session.',
	settings_recentFiles: 'Recent files',
	settings_recentFiles_desc: 'Set how many recent files display.',

	// Settings — appearance
	settings_logo: 'Logo',
	settings_logo_desc: 'Remove or set a custom logo. Accepts local files, links to images or lucide icon ids.',
	settings_invalidPath: 'The path/link/icon is not valid.',
	settings_typeAnything: 'Type anything ... ',
	settings_logoIconColor: 'Logo icon color',
	settings_logoIconColor_desc: 'Set the icon color',
	settings_logoScale: 'Logo scale',
	settings_logoScale_desc: 'Set the logo dimensions relative to the title font size.',
	settings_titleSetting: 'Title',
	settings_titleFont: 'Title font',
	settings_titleFont_desc: 'Interface font, text font, and monospace font options match the fonts set in the Appearance setting tab.',
	settings_titleFontSize: 'Title font size',
	settings_titleFontSize_desc: 'Accepts any CSS font-size value.',
	settings_invalidCss: 'The CSS unit is not valid.',
	settings_titleFontWeight: 'Title font weight',
	settings_titleColor: 'Title color',
	settings_selectionHighlight: 'Selection highlight',
	settings_selectionHighlight_desc: 'Set the color of the selected item.',

	// Settings — dropdown options
	opt_obsidianLogo: 'Obsidian logo',
	opt_oldLogo: 'Obsidian old logo',
	opt_localImage: 'Local image',
	opt_link: 'Link',
	opt_lucideIcon: 'Lucide icon',
	opt_empty: 'Empty',
	opt_themeDefault: 'Theme default',
	opt_accentColor: 'Accent color',
	opt_custom: 'Custom',
	opt_interfaceFont: 'Interface font',
	opt_textFont: 'Text font',
	opt_monospaceFont: 'Monospace font',
	opt_customFont: 'Custom font',

	// Settings — misc
	reset_default: 'Reset to default',

	// Commands
	cmd_openNewHomeTab: 'Open new Home tab',
	cmd_replaceCurrentTab: 'Replace current tab',

	// View
	view_displayText: 'Home tab',

	// Notices
	notice_omnisearchNotEnabled: 'Omnisearch plugins is not enabled.',
	notice_surfingNotEnabled: 'Surfing plugin is not enabled.',
	notice_bookmarksNotEnabled: 'Bookmarks plugin is not enabled',

	// Icon selection modal
	modal_setCustomIcon: 'Set a custom icon',
	modal_chooseIcon: 'Choose an icon',
	modal_chooseIcon_desc: 'Accepts any lucide icon id.',
	modal_invalidIcon: 'The icon id is not valid.',
	modal_typeToSearch: 'Type to start search...',
	modal_close: 'Close modal',
	modal_setIcon: 'Set icon',

	// Search bar
	search_placeholder: 'Type to start search...',

	// Recent files
	recentFiles_title: 'Recent files',
	recentFiles_hide: 'Hide file',

	// Bookmarked files
	bookmarks_remove: 'Remove bookmark',
	bookmarks_setIcon: 'Set custom icon',

	// Suggestions
	suggestion_aliasOf: 'Alias of',
	suggestion_notCreated: 'Not created yet, select to create',
	suggestion_nonExists: 'Non exists yet, select to create',
	suggestion_enterToCreate: 'Enter to create',

	// Hotkey hints
	hotkey_navigate: 'to navigate',
	hotkey_open: 'to open',
	hotkey_create: 'to create',
	hotkey_openNewTab: 'to open in new tab',
	hotkey_dismiss: 'to dismiss',

	// Surfing
	surfing_searchWith: 'Search with {engine}',
}

export default en
