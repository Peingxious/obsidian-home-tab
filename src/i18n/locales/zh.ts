import en from './en'

// Typed against the English locale so the compiler guarantees every key is
// translated; a missing string would be a type error here.
const zh: typeof en = {
	// Settings — headings
	settings_title: '主页标签设置',
	settings_general: '通用设置',
	settings_search: '搜索设置',
	settings_filesDisplay: '文件展示',
	settings_appearance: '外观',

	// Settings — general
	settings_replaceNewTabs: '用主页标签替换新标签页',
	settings_openOnStart: 'Obsidian 启动时打开新主页标签',
	settings_openOnStart_desc: '若主页标签已打开，则会聚焦它而不是打开新的。',
	settings_closePreviousOnStart: '启动时关闭上一个会话的标签页',
	settings_closePreviousOnStart_desc: '启用后将在打开 Obsidian 时关闭所有标签页，只保留一个主页标签。',

	// Settings — search
	settings_useOmnisearch: '使用 Omnisearch',
	settings_useOmnisearch_desc: '将 Omnisearch 设为默认搜索引擎。',
	settings_markdownOnly: '仅搜索 Markdown 文件',
	settings_showUncreated: '显示未创建的文件',
	settings_showPath: '显示文件路径',
	settings_showPath_desc: '在文件名右侧显示文件路径。',
	settings_showShortcuts: '显示快捷键',
	settings_showShortcuts_desc: '在搜索结果下方显示快捷键。',
	settings_searchResults: '搜索结果',
	settings_searchResults_desc: '设置显示的结果数量。',
	settings_searchDelay: '搜索延迟',
	settings_searchDelay_desc: '数值单位为毫秒。',
	settings_showExcerpt: '显示摘要（Omnisearch）',
	settings_showExcerpt_desc: '显示与搜索匹配的内容上下文。',

	// Settings — files display
	settings_showBookmarks: '显示书签文件',
	settings_showBookmarks_desc: '在搜索栏下方显示书签文件。',
	settings_showRecent: '显示最近文件',
	settings_showRecent_desc: '在搜索栏下方显示最近文件。',
	settings_storeRecent: '记住最近文件',
	settings_storeRecent_desc: '记住上一个会话中的最近文件。',
	settings_recentFiles: '最近文件',
	settings_recentFiles_desc: '设置显示的最近文件数量。',

	// Settings — appearance
	settings_logo: 'Logo',
	settings_logo_desc: '移除或设置自定义 Logo，支持本地文件、图片链接或 lucide 图标 ID。',
	settings_invalidPath: '路径/链接/图标无效。',
	settings_typeAnything: '输入任意内容 … ',
	settings_logoIconColor: 'Logo 图标颜色',
	settings_logoIconColor_desc: '设置图标颜色',
	settings_logoScale: 'Logo 缩放',
	settings_logoScale_desc: '设置 Logo 相对标题字体的尺寸。',
	settings_titleSetting: '标题',
	settings_titleFont: '标题字体',
	settings_titleFont_desc: '界面字体、文本字体和等宽字体选项与外观设置中的字体一致。',
	settings_titleFontSize: '标题字体大小',
	settings_titleFontSize_desc: '接受任意 CSS font-size 值。',
	settings_invalidCss: 'CSS 单位无效。',
	settings_titleFontWeight: '标题字重',
	settings_titleColor: '标题颜色',
	settings_selectionHighlight: '选中高亮',
	settings_selectionHighlight_desc: '设置选中项的颜色。',

	// Settings — dropdown options
	opt_obsidianLogo: 'Obsidian Logo',
	opt_oldLogo: 'Obsidian 旧 Logo',
	opt_localImage: '本地图片',
	opt_link: '链接',
	opt_lucideIcon: 'Lucide 图标',
	opt_empty: '留空',
	opt_themeDefault: '主题默认',
	opt_accentColor: '强调色',
	opt_custom: '自定义',
	opt_interfaceFont: '界面字体',
	opt_textFont: '文本字体',
	opt_monospaceFont: '等宽字体',
	opt_customFont: '自定义字体',

	// Settings — misc
	reset_default: '恢复默认',

	// Commands
	cmd_openNewHomeTab: '打开新主页标签',
	cmd_replaceCurrentTab: '替换当前标签页',

	// View
	view_displayText: '主页标签',

	// Notices
	notice_omnisearchNotEnabled: '未启用 Omnisearch 插件。',
	notice_surfingNotEnabled: '未启用 Surfing 插件。',
	notice_bookmarksNotEnabled: '未启用书签插件',

	// Icon selection modal
	modal_setCustomIcon: '设置自定义图标',
	modal_chooseIcon: '选择图标',
	modal_chooseIcon_desc: '接受任意 lucide 图标 ID。',
	modal_invalidIcon: '图标 ID 无效。',
	modal_typeToSearch: '输入以开始搜索…',
	modal_close: '关闭弹窗',
	modal_setIcon: '设置图标',

	// Search bar
	search_placeholder: '输入以开始搜索…',

	// Recent files
	recentFiles_title: '最近文件',
	recentFiles_hide: '隐藏文件',

	// Bookmarked files
	bookmarks_remove: '移除书签',
	bookmarks_setIcon: '设置自定义图标',

	// Suggestions
	suggestion_aliasOf: '别名',
	suggestion_notCreated: '尚未创建，选择以创建',
	suggestion_nonExists: '尚不存在，选择以创建',
	suggestion_enterToCreate: '按回车创建',

	// Hotkey hints
	hotkey_navigate: '导航',
	hotkey_open: '打开',
	hotkey_create: '创建',
	hotkey_openNewTab: '在新标签页打开',
	hotkey_dismiss: '关闭',

	// Surfing
	surfing_searchWith: '使用 {engine} 搜索',
}

export default zh
