import { MarkdownView, Plugin, WorkspaceLeaf } from 'obsidian';
import { t } from './i18n';
import { VIEW_TYPE } from './viewConstants'
// Type-only import: erased at build time, so it does not eagerly pull the
// (heavy) homeView module graph into the plugin's static load path.
import type { EmbeddedHomeTab } from './homeView'
import { HomeTabSettingTab, DEFAULT_SETTINGS, type HomeTabSettings } from './settings'
import { pluginSettingsStore, bookmarkedFiles } from './store'
import { RecentFileManager } from './recentFiles';
import { bookmarkedFilesManager } from './bookmarkedFiles';

// Obsidian 类型增强（ambient augmentation）集中在 src/obsidian-augmentation.d.ts
export default class HomeTab extends Plugin {
	settings: HomeTabSettings;
	recentFileManager: RecentFileManager
	bookmarkedFileManager: bookmarkedFilesManager
	activeEmbeddedHomeTabViews: EmbeddedHomeTab[]
	
	async onload() {
		console.log('Loading home-tab plugin')
		
		// Lazily evaluate the (heavy) Home view module graph — homepage, search bar,
		// suggesters, fuse.js, etc. — off the plugin's static load path. esbuild wraps
		// it as a lazy factory, so none of that code runs until this dynamic import
		// resolves (here, right after settings load instead of at plugin parse time).
		let HomeTabViewClass: typeof import('./homeView').HomeTabView
		await this.loadSettings();
		const homeViewModule = await import('./homeView')
		HomeTabViewClass = homeViewModule.HomeTabView
		this.addSettingTab(new HomeTabSettingTab(this.app, this))
		this.registerView(VIEW_TYPE, (leaf) => new HomeTabViewClass(leaf, this));		

		// Replace new tabs with home tab view
		this.registerEvent(this.app.workspace.on('layout-change', () => this.onLayoutChange()))
		// Refocus search bar on leaf change
		this.registerEvent(this.app.workspace.on('active-leaf-change', (leaf: WorkspaceLeaf) => {if(leaf.view instanceof HomeTabViewClass){leaf.view.searchBar.focusSearchbar()}}))

		pluginSettingsStore.set(this.settings) // Store the settings for the svelte components

		this.activeEmbeddedHomeTabViews = []

		this.recentFileManager = new RecentFileManager(app, this)
		this.recentFileManager.load()

		this.addCommand({
			id: 'open-new-home-tab',
			name: t('cmd_openNewHomeTab'),
			callback: () => this.activateView(false, true)})
		this.addCommand({
			id: 'open-home-tab',
			name: t('cmd_replaceCurrentTab'),
			callback: () => this.activateView(true)})

		// Wait for all plugins to load before check if the bookmarked plugin is enabled
		this.app.workspace.onLayoutReady(() => {
			if(this.app.internalPlugins.getPluginById('bookmarks')){
				this.bookmarkedFileManager = new bookmarkedFilesManager(app, this, bookmarkedFiles)
				this.bookmarkedFileManager.load()
			}

			this.registerMarkdownCodeBlockProcessor('search-bar', (source, el, ctx) => {
				const view = this.app.workspace.getActiveViewOfType(MarkdownView)
				if(view){
					// EmbeddedHomeTab is part of the lazily-loaded homeView module.
					import('./homeView').then(({ EmbeddedHomeTab }) => {
						let embeddedHomeTab = new EmbeddedHomeTab(el, view, this, source)
						this.activeEmbeddedHomeTabViews.push(embeddedHomeTab)
						ctx.addChild(embeddedHomeTab)
					})
				}
			})

			if(this.settings.newTabOnStart){
				// If an Home tab leaf is already open focus it
				const leaves = app.workspace.getLeavesOfType(VIEW_TYPE)
				if(leaves.length > 0){
					app.workspace.revealLeaf(leaves[0])
					// If more than one home tab leaf is open close them
					leaves.forEach((leaf, index) => {
						if(index < 1) return
						leaf.detach()
					})
				}
				else{
					this.activateView(false, true)
				}
				// Close all other open leaves
				if(this.settings.closePreviousSessionTabs){
					// Get open leaves type
					const leafTypes: string[] = []
					app.workspace.iterateRootLeaves((leaf) => {
						const leafType = leaf.view.getViewType()
						if(leafTypes.indexOf(leafType) === -1 && leafType != VIEW_TYPE){
							leafTypes.push(leafType)
						}
					})
					leafTypes.forEach((type) => app.workspace.detachLeavesOfType(type))
				}
			}
		})
	}

	onunload(): void {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE)
		this.activeEmbeddedHomeTabViews.forEach(view => view.unload())
		this.recentFileManager.unload()
		this.bookmarkedFileManager.unload()
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings)
		pluginSettingsStore.update(() => this.settings)
	}

	private onLayoutChange(): void{
		if(this.settings.replaceNewTabs){
			this.activateView()
		}
	}

	public activateView(overrideView?: boolean, openNewTab?: boolean):void {
		const leaf = openNewTab ? app.workspace.getLeaf('tab') : app.workspace.getMostRecentLeaf()
		// const leaf = newTab ? app.workspace.getLeaf() : app.workspace.getMostRecentLeaf()
		if(leaf && (overrideView || leaf.getViewState().type === 'empty')){
			leaf.setViewState({
				type: VIEW_TYPE,
			})
			// Focus newly opened tab
			if(openNewTab){app.workspace.revealLeaf(leaf)}
		}
	}

	public refreshOpenViews(): void {
		this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach((leaf) => leaf.rebuildView())
	}
}