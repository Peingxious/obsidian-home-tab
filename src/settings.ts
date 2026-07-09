import { App, Setting, PluginSettingTab, normalizePath, Platform } from 'obsidian'
import type HomeTab from './main'
import iconSuggester from './suggester/iconSuggester'
import { lucideIcons, type LucideIcon } from './utils/lucideIcons'
import ImageFileSuggester from './suggester/imageSuggester'
import cssUnitValidator from './utils/cssUnitValidator'
import isLink from './utils/isLink'
import type fontSuggesterType from './suggester/fontSuggester'
import type { recentFileStore } from './recentFiles'
import type { bookmarkedFileStore } from './bookmarkedFiles'
import { checkFont } from './utils/fontValidator'
import { t } from './i18n'

type ColorChoices = 'default' | 'accentColor' | 'custom'
type LogoChoiches = 'default' | 'imagePath' | 'imageLink' | 'lucideIcon' | 'oldLogo' | 'none'
type FontChoiches = 'interfaceFont' | 'textFont' | 'monospaceFont' | 'custom'

interface ObjectKeys {
    [key: string]: any
}

interface logoStore extends ObjectKeys{
    lucideIcon: LucideIcon | ''
    imagePath: string
    imageLink: string
}

export interface HomeTabSettings extends ObjectKeys{
    logoType: LogoChoiches
    logo: logoStore
    logoScale: number
    iconColor?: string
    iconColorType: ColorChoices
    wordmark: string
    customFont: FontChoiches
    font?: string
    fontSize: string
    fontColor?: string
    fontColorType: ColorChoices
    fontWeight: number
    maxResults: number
    showbookmarkedFiles: boolean
    showRecentFiles: boolean
    maxRecentFiles: number
    storeRecentFile: boolean
    showPath: boolean
    selectionHighlight: ColorChoices
    showShortcuts: boolean
    markdownOnly: boolean
    unresolvedLinks: boolean
    recentFilesStore: recentFileStore[]
    bookmarkedFileStore: bookmarkedFileStore[]
    searchDelay: number
    replaceNewTabs: boolean
    newTabOnStart: boolean
    closePreviousSessionTabs: boolean
    omnisearch: boolean
    showOmnisearchExcerpt: boolean
}

export const DEFAULT_SETTINGS: HomeTabSettings = {
    logoType: 'default',
    logo: {
        lucideIcon: '', 
        imagePath: '', 
        imageLink: '',},
    logoScale: 1.2,
    iconColorType: 'default',
    wordmark: 'Obsidian',
    customFont: 'interfaceFont',
    fontSize: '4em',
    fontColorType: 'default', 
    fontWeight: 600,
    maxResults: 5,
    showbookmarkedFiles: app.internalPlugins.getPluginById('bookmarks') ? true : false,
    showRecentFiles: false,
    maxRecentFiles: 5,
    storeRecentFile: true,
    showPath: true,
    selectionHighlight: 'default',
    showShortcuts: true,
    markdownOnly: false,
    unresolvedLinks: false,
    recentFilesStore: [],
    bookmarkedFileStore: [],
    searchDelay: 0,
    replaceNewTabs: true,
    newTabOnStart: false,
    closePreviousSessionTabs: false,
    omnisearch: false,
    showOmnisearchExcerpt: true,
}


export class HomeTabSettingTab extends PluginSettingTab{
    plugin: HomeTab
    
    constructor(app: App, plugin: HomeTab){
        super(app, plugin)
        this.plugin = plugin
    }

    display(): void{
        const {containerEl} = this
        containerEl.empty()

		containerEl.createEl('h3', {text: t('settings_title')});

        containerEl.createEl('h2', {text: t('settings_general')});
        new Setting(containerEl)
        .setName(t('settings_replaceNewTabs'))
        .addToggle(toggle => toggle
            .setValue(this.plugin.settings.replaceNewTabs)
            .onChange(value => {this.plugin.settings.replaceNewTabs = value; this.plugin.saveSettings()}))

        new Setting(containerEl)
        .setName(t('settings_openOnStart'))
        .setDesc(t('settings_openOnStart_desc'))
        .addToggle(toggle => toggle
            .setValue(this.plugin.settings.newTabOnStart)
            .onChange(value => {this.plugin.settings.newTabOnStart = value; this.plugin.saveSettings(); this.display()}))

        if(this.plugin.settings.newTabOnStart){
            new Setting(containerEl)
                .setName(t('settings_closePreviousOnStart'))
                .setDesc(t('settings_closePreviousOnStart_desc'))
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.closePreviousSessionTabs)
                    .onChange(value => {this.plugin.settings.closePreviousSessionTabs = value; this.plugin.saveSettings()}))
        }

		containerEl.createEl('h2', {text: t('settings_search')});
        if(this.plugin.app.plugins.getPlugin('omnisearch')){
            new Setting(containerEl)
                .setName(t('settings_useOmnisearch'))
                .setDesc(t('settings_useOmnisearch_desc'))
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.omnisearch)
                    .onChange(value => {this.plugin.settings.omnisearch = value; this.plugin.saveSettings(); this.display(); this.plugin.refreshOpenViews()}))
        }
        if(!this.plugin.settings.omnisearch){
            new Setting(containerEl)
                .setName(t('settings_markdownOnly'))
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.markdownOnly)
                    .onChange(value => {this.plugin.settings.markdownOnly = value; this.plugin.saveSettings(); this.plugin.refreshOpenViews()}))
    
            new Setting(containerEl)
                .setName(t('settings_showUncreated'))
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.unresolvedLinks)
                    .onChange(value => {this.plugin.settings.unresolvedLinks = value; this.plugin.saveSettings(); this.plugin.refreshOpenViews()}))
            
            new Setting(containerEl)
                .setName(t('settings_showPath'))
                .setDesc(t('settings_showPath_desc'))
                .addToggle((toggle) => toggle
                    .setValue(this.plugin.settings.showPath)
                    .onChange((value) => {this.plugin.settings.showPath = value; this.plugin.saveSettings()}))
        }

        new Setting(containerEl)
            .setName(t('settings_showShortcuts'))
            .setDesc(t('settings_showShortcuts_desc'))
            .addToggle((toggle) => toggle
                .setValue(this.plugin.settings.showShortcuts)
                .onChange((value) => {
                    this.plugin.settings.showShortcuts = value
                    this.plugin.refreshOpenViews()
                    this.plugin.saveSettings()
                }
            ))

        new Setting(containerEl)
            .setName(t('settings_searchResults'))
            .setDesc(t('settings_searchResults_desc'))
            .addSlider((slider) => slider
                .setLimits(1, 25, 1)
                .setValue(this.plugin.settings.maxResults)
                .setDynamicTooltip()
                .onChange((value) => {this.plugin.settings.maxResults = value; this.plugin.saveSettings()}))
            .then((settingEl) => this.addResetButton(settingEl, 'maxResults'))

        new Setting(containerEl)
            .setName(t('settings_searchDelay'))
            .setDesc(t('settings_searchDelay_desc'))
            .addSlider((slider) => slider
                .setLimits(0, 500, 10)
                .setValue(this.plugin.settings.searchDelay)
                .setDynamicTooltip()
                .onChange((value) => {this.plugin.settings.searchDelay = value; this.plugin.saveSettings(); this.plugin.refreshOpenViews()}))
            .then((settingEl) => this.addResetButton(settingEl, 'searchDelay'))

        if(this.plugin.app.plugins.getPlugin('omnisearch')){
            new Setting(containerEl)
                .setName(t('settings_showExcerpt'))
                .setDesc(t('settings_showExcerpt_desc'))
                .addToggle((toggle) => toggle
                    .setValue(this.plugin.settings.showOmnisearchExcerpt)
                    .onChange((value) => {
                        this.plugin.settings.showOmnisearchExcerpt = value
                        this.plugin.saveSettings()
                    }
                ))
        }

        containerEl.createEl('h2', {text: t('settings_filesDisplay')});
        
        if(app.internalPlugins.getPluginById('bookmarks')){
            new Setting(containerEl)
            .setName(t('settings_showBookmarks'))
            .setDesc(t('settings_showBookmarks_desc'))
            .addToggle((toggle) => toggle
                .setValue(this.plugin.settings.showbookmarkedFiles)
                .onChange((value) => {this.plugin.settings.showbookmarkedFiles = value; this.plugin.saveSettings(); this.plugin.refreshOpenViews()
                    // if(value && !this.plugin.bookmarkedFileManager){
                    //     this.plugin.bookmarkedFileManager = new bookmarkedFileManager(this.app, this.plugin, bookmarkedFiles)
                    // }
                    // value ? this.plugin.bookmarkedFileManager.load() : this.plugin.bookmarkedFileManager.unload() // Detach bookmarkedFileManager instance
                }))
        }

        new Setting(containerEl)
            .setName(t('settings_showRecent'))
            .setDesc(t('settings_showRecent_desc'))
            .addToggle((toggle) => toggle
                .setValue(this.plugin.settings.showRecentFiles)
                .onChange((value) => {this.plugin.settings.showRecentFiles = value; this.plugin.saveSettings(); this.display(); this.plugin.refreshOpenViews()
                    // if(value && !this.plugin.recentFileManager){
                    //     this.plugin.recentFileManager = new RecentFileManager(this.app, this.plugin)
                    // }
                    // value ? this.plugin.recentFileManager.load() : this.plugin.recentFileManager.unload() // Detach recentFileManager instance
                }))

        if(this.plugin.settings.showRecentFiles){
            new Setting(containerEl)
            .setName(t('settings_storeRecent'))
            .setDesc(t('settings_storeRecent_desc'))
            .addToggle((toggle) => toggle
                .setValue(this.plugin.settings.storeRecentFile)
                .onChange((value) => {this.plugin.settings.storeRecentFile = value; this.plugin.saveSettings()}))

            new Setting(containerEl)
                .setName(t('settings_recentFiles'))
                .setDesc(t('settings_recentFiles_desc'))
                .addSlider((slider) => slider
                    .setValue(this.plugin.settings.maxRecentFiles)
                    .setLimits(1, 25, 1)
                    .setDynamicTooltip()
                    .onChange((value) => {this.plugin.recentFileManager.onNewMaxListLenght(value); this.plugin.settings.maxRecentFiles = value; this.plugin.saveSettings()}))
                .then((settingEl) => this.addResetButton(settingEl, 'maxRecentFiles'))
        }

        containerEl.createEl('h2', {text: t('settings_appearance')});

        const logoTypeSetting = new Setting(containerEl)
            .setName(t('settings_logo'))
            .setDesc(t('settings_logo_desc'))

        logoTypeSetting.descEl.parentElement?.addClass('ultra-compressed')

        let invalidInputIcon: HTMLElement
        logoTypeSetting
            .addExtraButton((button) => {button
                .setIcon('alert-circle')
                .setTooltip(t('settings_invalidPath'))
                invalidInputIcon = button.extraSettingsEl
                invalidInputIcon.toggleVisibility(false)
                invalidInputIcon.addClass('mod-warning')})

        if(this.plugin.settings.logoType === 'imagePath' || this.plugin.settings.logoType === 'imageLink' || this.plugin.settings.logoType === 'lucideIcon'){
            logoTypeSetting
                .addSearch((text) => {
                    if(this.plugin.settings.logoType === 'imagePath'){
                        new ImageFileSuggester(this.app, text.inputEl, {
                            isScrollable: true,
                            style: `max-height: 200px`
                        })
                    }
                    else if(this.plugin.settings.logoType === 'lucideIcon'){
                        new iconSuggester(this.app, text.inputEl, {
                            isScrollable: true,
                            style: `max-height: 200px`}, 
                            true)
                    }
                    text
                        // .setPlaceholder(this.plugin.settings.logo[this.plugin.settings.logoType] != '' ? this.plugin.settings.logo[this.plugin.settings.logoType] : 'Type anything ... ')
                        .setPlaceholder(t('settings_typeAnything'))
                        .setValue(this.plugin.settings.logo[this.plugin.settings.logoType] != '' ? this.plugin.settings.logo[this.plugin.settings.logoType] : '')
                        .onChange(async (value) => {
                            if(value === '' || value == '/'){
                                invalidInputIcon.toggleVisibility(false)
                                return
                            }
                            if(this.plugin.settings.logoType === 'imagePath'){
                                const normalizedPath = normalizePath(value)
                                if (await app.vault.adapter.exists(normalizedPath)){
                                    invalidInputIcon.toggleVisibility(false)
                                    this.plugin.settings.logo['imagePath'] = normalizedPath
                                    this.plugin.saveSettings()
                                }
                                else{
                                    invalidInputIcon.toggleVisibility(true)
                                }
                            }
                            else if(this.plugin.settings.logoType === 'imageLink'){
                                if(isLink(value)){
                                    invalidInputIcon.toggleVisibility(false)
                                    this.plugin.settings.logo['imageLink'] = value
                                    this.plugin.saveSettings()
                                }
                                else{
                                    invalidInputIcon.toggleVisibility(true)
                                }
                            }
                            else if(this.plugin.settings.logoType === 'lucideIcon'){
                                if(lucideIcons.includes(value as LucideIcon)){
                                    this.plugin.settings.logo['lucideIcon'] = value as LucideIcon
                                    this.plugin.saveSettings()
                                    invalidInputIcon.toggleVisibility(false)
                                }
                                else{
                                    invalidInputIcon.toggleVisibility(true)
                                }
                            }
                        })
                        .inputEl.parentElement?.addClass('wide-input-container')
                })
        }

        logoTypeSetting
            .addDropdown((dropdown) => dropdown
                .addOption('default', t('opt_obsidianLogo'))
                .addOption('oldLogo', t('opt_oldLogo'))
                .addOption('imagePath', t('opt_localImage'))
                .addOption('imageLink', t('opt_link'))
                .addOption('lucideIcon', t('opt_lucideIcon'))
                .addOption('none', t('opt_empty'))
                .setValue(this.plugin.settings.logoType)
                .onChange((value: LogoChoiches) => {this.plugin.settings.logoType = value; this.plugin.saveSettings(); this.display()}))
            .then((settingEl) => this.addResetButton(settingEl, 'logoType'))
        
        if(this.plugin.settings.logoType === 'lucideIcon'){
            const iconColorSetting = new Setting(containerEl)
                .setName(t('settings_logoIconColor'))
                .setDesc(t('settings_logoIconColor_desc'))
                
            if (this.plugin.settings.iconColorType === 'custom'){
                iconColorSetting.addColorPicker((colorPicker) => colorPicker
                    .setValue(this.plugin.settings.iconColor ? this.plugin.settings.iconColor : '#000000')
                    .onChange((value) => {this.plugin.settings.iconColor = value; this.plugin.saveSettings()}))
            }
                
            iconColorSetting
                .addDropdown((dropdown) => dropdown
                    .addOption('default', t('opt_themeDefault'))
                    .addOption('accentColor', t('opt_accentColor'))
                    .addOption('custom', t('opt_custom'))
                    .setValue(this.plugin.settings.iconColorType)
                    .onChange((value: ColorChoices) => {this.plugin.settings.iconColorType = value; this.plugin.saveSettings(); this.display()}))
            .then((settingEl) => this.addResetButton(settingEl, 'iconColorType'))
        }
        
        new Setting(containerEl)
            .setName(t('settings_logoScale'))
            .setDesc(t('settings_logoScale_desc'))
            .addSlider((slider) => slider
                .setDynamicTooltip()
                .setLimits(0.3,3, 0.1)
                .setValue(this.plugin.settings.logoScale)
                .onChange((value) => {
                    this.plugin.settings.logoScale = value
                    this.plugin.saveSettings()
            }))
            .then((settingEl) => this.addResetButton(settingEl, 'logoScale'))
        
        new Setting(containerEl)
            .setName(t('settings_titleSetting'))
            // .setDesc('Set a custom title')
            .addText((text) => text
                .setValue(this.plugin.settings.wordmark)
                .onChange((value) => {
                    this.plugin.settings.wordmark = value
					this.plugin.saveSettings()
                }))
            .then((settingEl) => this.addResetButton(settingEl, 'wordmark'))


        const titleFontSettings = new Setting(containerEl)
            .setName(t('settings_titleFont'))
            .setDesc(t('settings_titleFont_desc'))
            // .setDesc(createFragment(f => {
            //     f.appendText('Interface font, text font, and monospace font options');
            //     f.createEl('br')
            //     f.appendText('match the fonts set in the Appearance setting tab.')
            //   }))

        titleFontSettings.descEl.parentElement?.addClass('compressed')

        if(this.plugin.settings.customFont === 'custom'){
            let invalidFontIcon: HTMLElement
            titleFontSettings
                .addExtraButton((button) => {button
                    .setIcon('alert-circle')
                    .setTooltip(t('settings_invalidCss'))
                    invalidFontIcon = button.extraSettingsEl
                    invalidFontIcon.toggleVisibility(false)
                    invalidFontIcon.addClass('mod-warning')})

            titleFontSettings.addSearch((text) => {
                text.setValue(this.plugin.settings.font ? this.plugin.settings.font.replace(/"/g, ''): '')
                text.setPlaceholder(t('settings_typeAnything'))
                let suggester: fontSuggesterType | undefined
                if(!Platform.isMobile && !Platform.isMacOS){
                    // Lazily load fontSuggester (and the native font-list module it
                    // depends on) only when the font picker is actually rendered.
                    import('./suggester/fontSuggester').then(({ default: fontSuggester }) => {
                        suggester = new fontSuggester(this.app, text.inputEl, {
                            isScrollable: true,
                            style: `max-height: 200px;
                            width: fit-content;
                            min-width: 200px;`}, 
                            true)
                    })
                }

                text.onChange(async (value) => {
                    value = value.indexOf(' ') >= 0 ? `"${value}"` : value //Restore "" if font name contains whitespaces
                    if((suggester && (await suggester.getInstalledFonts()).includes(value)) || checkFont(value) ){
                        this.plugin.settings.font = value
                        this.plugin.saveSettings()
                        invalidFontIcon.toggleVisibility(false)
                    }
                    else{
                        invalidFontIcon.toggleVisibility(true)
                    }
                })
                .inputEl.parentElement?.addClass('wide-input-container')
            })
        }

        titleFontSettings
            .addDropdown(dropdown => dropdown
                .addOption('interfaceFont', t('opt_interfaceFont'))
                .addOption('textFont', t('opt_textFont'))
                .addOption('monospaceFont', t('opt_monospaceFont'))
                .addOption('custom', t('opt_customFont'))
                .setValue(this.plugin.settings.customFont)
                .onChange((value: FontChoiches) => {
                    this.plugin.settings.customFont = value
                    this.plugin.saveSettings()
                    this.display()
                })
            )
        this.addResetButton(titleFontSettings, 'customFont')

        let invalidFontSizeIcon: HTMLElement
        new Setting(containerEl)
            .setName(t('settings_titleFontSize'))
            .setDesc(t('settings_titleFontSize_desc'))
            .addExtraButton((button) => {button
                .setIcon('alert-circle')
                .setTooltip(t('settings_invalidCss'))
                invalidFontSizeIcon = button.extraSettingsEl
                invalidFontSizeIcon.addClass('mod-warning')
                invalidFontSizeIcon.toggleVisibility(false)
            })
            .addText((text) => text
                .setValue(this.plugin.settings.fontSize)
                .onChange((value) => {
                    if(cssUnitValidator(value)){
                        this.plugin.settings.fontSize = value
                        this.plugin.saveSettings()
                        invalidFontSizeIcon.toggleVisibility(false)
                    }
                    else{
                        invalidFontSizeIcon.toggleVisibility(true)
                    }
                }))
            .then((settingEl) => this.addResetButton(settingEl, 'fontSize'))

        new Setting(containerEl)
            .setName(t('settings_titleFontWeight'))
            // .setDesc('Set title font weight')
            .addSlider((slider) => slider
                .setLimits(100, 900, 100)
                .setDynamicTooltip()
                .setValue(this.plugin.settings.fontWeight)
                .onChange((value) => {
                    this.plugin.settings.fontWeight = value
                    this.plugin.saveSettings()
                }))
            .then((settingEl) => this.addResetButton(settingEl, 'fontWeight'))

        const titleColorSetting = new Setting(containerEl)
            .setName(t('settings_titleColor'))

        if (this.plugin.settings.fontColorType === 'custom'){
            titleColorSetting.addColorPicker((colorPicker) => colorPicker
                .setValue(this.plugin.settings.fontColor?this.plugin.settings.fontColor : '#000000')
                .onChange((value) => {this.plugin.settings.fontColor = value; this.plugin.saveSettings()}))
        }

        titleColorSetting
            .addDropdown((dropdown) => dropdown
                .addOption('default', t('opt_themeDefault'))
                .addOption('accentColor', t('opt_accentColor'))
                .addOption('custom', t('opt_custom'))
                .setValue(this.plugin.settings.fontColorType)
                .onChange((value: ColorChoices) => {this.plugin.settings.fontColorType = value; this.plugin.saveSettings(); this.display()}))
            .then((settingEl) => this.addResetButton(settingEl, 'fontColorType'))
    
        new Setting(containerEl)
        .setName(t('settings_selectionHighlight'))
        .setDesc(t('settings_selectionHighlight_desc'))
        .addDropdown((dropdown) => dropdown
            .addOption('default', t('opt_themeDefault'))
            .addOption('accentColor', t('opt_accentColor'))
            .setValue(this.plugin.settings.selectionHighlight)
            .onChange((value: ColorChoices) => {this.plugin.settings.selectionHighlight = value; this.plugin.saveSettings(); this.plugin.refreshOpenViews()}))
        .then((settingEl) => this.addResetButton(settingEl, 'selectionHighlight'))
    }

    addResetButton(settingElement: Setting, settingKey: string, refreshView: boolean = true){
        settingElement
            .addExtraButton((button) => button
                    .setIcon('reset')
                    .setTooltip(t('reset_default'))
                    .onClick(() => {
                        this.plugin.settings[settingKey] = DEFAULT_SETTINGS[settingKey]
                        this.plugin.saveSettings()
                        if(refreshView){this.display()}
                    }))
    }
}