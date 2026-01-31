import { Plugin, ItemView, WorkspaceLeaf } from 'obsidian'


import { TreeRoot } from './TreeRoot';


/*



**/



// Import the Counter Svelte component and the `mount` and `unmount` methods.

// step 1

import testsidebar from './svelte-components/dummy/test_sidebar.svelte';
import TagExplorer from './svelte-components/TagExplorer.svelte';

import { mount, unmount } from 'svelte';

 
import {initModelInterface} from './modelInterface'


import {DEFAULT_SETTINGS, TagFolderSettingTab} from "./settings";
import type {TagFolderPluginSettings} from "./settings";

const VIEW_TYPE_EXPLORER = 'explorer-view'
const VIEW_TYPE_TAG_EXPLORER = 'tag-explorer-view'




class ExplorerView extends ItemView {

  // step 2

  sidebar: ReturnType<typeof testsidebar> | undefined;


  constructor(leaf: WorkspaceLeaf) { super(leaf) }

  getViewType() { return VIEW_TYPE_EXPLORER }

  getDisplayText() { return 'Explorer view' }

 
  async onOpen() {
    this.renderView()
  }
  
  
  
  private renderView(){
    const c = this.contentEl
    c.empty()
    // c.createEl('h4', { text: 'Explorer view' })
	  // Attach the Svelte component to the ItemViews content element and provide the needed props.
    
    // step 3
    // this.counter = mount(Counter, {
    //   target: this.contentEl,
    //   props: {
    //     startCount: 5,
    //   }
    // });




    this.sidebar = mount(testsidebar, {
      target: this.contentEl
    });    
    console.log("sidebar mounted")
  }


  
  async onClose() {
    if (this.sidebar) {
      // Remove the Counter from the ItemView.
      unmount(this.sidebar);
    }


  }
}




class TagExplorerView extends ItemView {
  component: ReturnType<typeof TagExplorer> | undefined;
  plugin: TagFolderPlugin;
  private currentTreeVersion: number = 0;
  private currentPath: string = "";

  constructor(leaf: WorkspaceLeaf, plugin: TagFolderPlugin) { 
    super(leaf)
    this.plugin = plugin;
  }

  getViewType() { 
    return VIEW_TYPE_TAG_EXPLORER 
  }

  getDisplayText() { 
    return 'Tag Explorer' 
  }

  async onOpen() {
    // Register this view with the plugin
    this.plugin.addViewInstance(this);
    
    // Listen for when this view becomes active
    this.registerEvent(
      this.app.workspace.on('active-leaf-change', (leaf) => {
        if (leaf === this.leaf) {
          this.onViewBecameActive();
        }
      })
    );
    
    this.renderView()
  }
  
  /**
   * Called when this view becomes the active view
   * Checks if tree version has changed and updates if necessary
   */
  private onViewBecameActive(): void {
    const currentBackendVersion = this.plugin.getTreeVersion();
    
    // Only fetch new tree if version has changed
    if (this.currentTreeVersion !== currentBackendVersion) {
      this.refreshTree();
    }
  }
  
  /**
   * Refresh the tree from the backend
   */
  private refreshTree(): void {
    if (!this.component) return;
    
    const treeData = this.plugin.treeRoot?.getSortedTree();
    const version = this.plugin.getTreeVersion();
    
    if (treeData) {
      this.updateTree(treeData, version);
    }
  }
  
  /**
   * Update the tree with new data and version
   * Called by the plugin when broadcasting updates
   * Also refreshes the current node in the main view
   * 
   * @param treeData - The serialized tree data
   * @param version - The tree version number
   */
  updateTree(treeData: unknown, version: number): void {
    this.currentTreeVersion = version;
    
    if (this.component) {
      // Update the Svelte component with new tree data and trigger node refresh
      this.component.updateTreeData?.(treeData, version);
      this.component.refreshCurrentNode?.();
    }
  }
  
  /**
   * Set the current path being viewed in the main panel
   * Called by the Svelte component when the path changes
   * 
   * @param path - The current tag path
   */
  setCurrentPath(path: string): void {
    this.currentPath = path;
  }
  
  private renderView() {
    const c = this.contentEl
    c.empty()
    
    // Get initial tree data with version
    const treeData = this.plugin.treeRoot?.getSortedTree();
    const version = this.plugin.getTreeVersion();
    this.currentTreeVersion = version;
    
    this.component = mount(TagExplorer, {
      target: this.contentEl,
      props: {
        settings: this.plugin.settings,
        initialTreeData: treeData,
        initialVersion: version
      }
    });
    
    console.log("Tag Explorer mounted with version:", version)
  }
  
  async onClose() {
    // Unregister this view from the plugin
    this.plugin.removeViewInstance(this);
    
    if (this.component) {
      unmount(this.component);
    }
  }
}


export default class TagFolderPlugin extends Plugin {

	settings: TagFolderPluginSettings = DEFAULT_SETTINGS;


	treeRoot: TreeRoot | null = null;
	
	/**
	 * Track all active TagExplorerView instances for broadcasting updates.
	 * Views are added in onOpen() and removed in onClose().
	 */
	private activeViews: Set<TagExplorerView> = new Set();

 


  async onload() {

    await this.loadSettings();

		console.log('Tag Folder Plugin loaded');

    this.registerView(VIEW_TYPE_EXPLORER, leaf => new ExplorerView(leaf))
    this.registerView(VIEW_TYPE_TAG_EXPLORER, leaf => new TagExplorerView(leaf, this))

		// Wait for the metadata cache to be fully resolved before computing the tree
		// The metadata cache is populated asynchronously after vault load,
		// so we need to wait for it to be ready before building the tag tree
		this.app.workspace.onLayoutReady(() => {
			// Check if metadata cache is already resolved
			if (this.app.metadataCache.resolvedLinks) {
				this.initializeTree();
			} else {
				// Wait for the metadata cache to finish resolving
				const resolveRef = this.app.metadataCache.on('resolved', () => {
					this.initializeTree();
					this.app.metadataCache.offref(resolveRef);
				});
				this.registerEvent(resolveRef);
			}
		});


    this.addRibbonIcon('dice', 'Open Explorer', () => this.activateView())
    this.addRibbonIcon('folder-tree', 'Open Tag Explorer', () => this.activateTagExplorerView())

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TagFolderSettingTab(this.app, this));

    
  }  

	/**
	 * Initializes the tag tree after the metadata cache is ready.
	 * This is called after both the layout and metadata cache are resolved.
	 */
	private initializeTree(): void {
		// Construct the tag tree structure
		this.treeRoot = new TreeRoot(this.app, this.settings);
		
		console.log('Tag tree constructed successfully (metadata cache resolved)');

		initModelInterface(this.treeRoot);

		const temp = this.treeRoot.getSortedTree();
		console.log(temp);
		
		// Note: Initial tree construction doesn't broadcast since no views exist yet
		// When tree is modified later (e.g., by orchestrator), call this.broadcastTreeUpdate()
	}

  async activateView() {
    const w = this.app.workspace
    
    let leaf = w.getLeaf(true)
    await leaf.setViewState({ type: VIEW_TYPE_EXPLORER, active: true })
    
    w.revealLeaf(leaf)
  }



  async activateTagExplorerView() {
    const w = this.app.workspace
    let leaf = w.getLeaf(true)
    await leaf.setViewState({ type: VIEW_TYPE_TAG_EXPLORER, active: true })
    w.revealLeaf(leaf)
  }
  
  /**
   * Register a TagExplorerView instance with the plugin for tracking
   * 
   * @param view - The TagExplorerView instance to register
   */
  addViewInstance(view: TagExplorerView): void {
    this.activeViews.add(view);
  }
  
  /**
   * Unregister a TagExplorerView instance from the plugin
   * 
   * @param view - The TagExplorerView instance to unregister
   */
  removeViewInstance(view: TagExplorerView): void {
    this.activeViews.delete(view);
  }
  
  /**
   * Get the current tree version from the TreeRoot
   * 
   * @returns number - The current tree version counter
   */
  getTreeVersion(): number {

 
    // let counter_temp = 0 
    // this.activeViews.forEach(view => {
    //   // Check if the view is a TagExplorerView and its container element is visible in the UI
    //   if (view instanceof TagExplorerView && view.containerEl.isShown()) {
    //     counter_temp += 1
    //   }
    // });

    // console.log("number of active views with my plugin leaf:", counter_temp)



    return this.treeRoot?.getTreeVersion() ?? 0;

  }
  
  /**
   * Broadcast tree updates to all currently active (visible) views
   * 
   * Only views that are visible in the UI will receive the update.
   * This implements lazy updating for better performance.
   */
  broadcastTreeUpdate(): void {
    if (!this.treeRoot) return;
    
    const serializedTree = this.treeRoot.getSortedTree();
    const version = this.treeRoot.getTreeVersion();
    
    // Broadcast to all active views that are currently visible
    this.activeViews.forEach(view => {
      // Check if the view is a TagExplorerView and its container element is visible in the UI
      if (view instanceof TagExplorerView && view.containerEl.isShown()) {
        view.updateTree(serializedTree, version);
        // console.log("Broadcasted tree update to view with version:", version);
      }
    });
  }
  

	onunload() {
		console.log('Tag Folder Plugin unloaded');
		
		// Clean up the tree reference
		this.treeRoot = null;
    

    
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<TagFolderPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}  

}
