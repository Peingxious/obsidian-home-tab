declare module 'obsidian'{
	interface App{
		internalPlugins: InternalPlugins
		plugins: Plugins
		dom: any
		isMobile: boolean
	}
	interface InternalPlugins{
		getPluginById: Function
		plugins: {
			bookmarks: BookmarksPlugin
		}
	}
	interface Plugins{
		getPlugin: (id: string) => Plugin_2
	}
	interface BookmarksPlugin extends Plugin_2{
		instance: {
			items: BookmarkItem[]
			getBookmarks: () => BookmarkItem[]
			removeItem: (item: BookmarkItem) => void
		}
	}
	interface BookmarkItem{
		type: string,
		title: string | undefined,
		path: string
	}
	interface config{
		nativeMenus: boolean
	}
	interface Vault{
		config: config
	}
	interface Workspace{
		createLeafInTabGroup: Function
	}
	interface WorkspaceLeaf{
		rebuildView: Function
		parent: WorkspaceSplit
		activeTime: number
		app: App
	}
	interface WorkspaceSplit{
		children: WorkspaceLeaf[]
	}
	interface TFile{
		deleted: boolean
	}
}
