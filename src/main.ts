import { Plugin, ItemView, WorkspaceLeaf } from 'obsidian'


import { TreeRoot } from './TreeRoot';


/*


**/



// Import the Counter Svelte component and the `mount` and `unmount` methods.

// step 1
import Counter from './svelte-components/Counter.svelte';
import testsidebar from './svelte-components/test_sidebar.svelte';
import DualSidebar from './svelte-components/DualSidebar.svelte';

import { mount, unmount } from 'svelte';

 
import {initModelInterface} from './modelInterface'


import {DEFAULT_SETTINGS, TagFolderSettingTab} from "./settings";
import type {TagFolderPluginSettings} from "./settings";

const VIEW_TYPE_EXPLORER = 'explorer-view'
const VIEW_TYPE_DUAL_SIDEBAR = 'dual-sidebar-view'




class ExplorerView extends ItemView {

  // step 2
  counter: ReturnType<typeof Counter> | undefined;
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
    if (this.counter) {
      // Remove the Counter from the ItemView.
      unmount(this.counter);
    }


  }
}




class DualSidebarView extends ItemView {
  component: ReturnType<typeof DualSidebar> | undefined;

  constructor(leaf: WorkspaceLeaf) { 
    super(leaf) 
  }

  getViewType() { 
    return VIEW_TYPE_DUAL_SIDEBAR 
  }

  getDisplayText() { 
    return 'Dual Sidebar View' 
  }

  async onOpen() {
    this.renderView()
  }
  
  private renderView() {
    const c = this.contentEl
    c.empty()
    
    this.component = mount(DualSidebar, {
      target: this.contentEl
    });
    
    console.log("Dual sidebar mounted")
  }
  
  async onClose() {
    if (this.component) {
      unmount(this.component);
    }
  }
}


export default class TagFolderPlugin extends Plugin {

	settings: TagFolderPluginSettings = DEFAULT_SETTINGS;


	private treeRoot: TreeRoot | null = null;


  async onload() {

    await this.loadSettings();

		console.log('Tag Folder Plugin loaded');

    this.registerView(VIEW_TYPE_EXPLORER, leaf => new ExplorerView(leaf))
    this.registerView(VIEW_TYPE_DUAL_SIDEBAR, leaf => new DualSidebarView(leaf))

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
    this.addRibbonIcon('folder-tree', 'Open Dual Sidebar', () => this.activateDualView())

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
	}

  async activateView() {
    const w = this.app.workspace
    
    let leaf = w.getLeaf(true)
    await leaf.setViewState({ type: VIEW_TYPE_EXPLORER, active: true })
    
    w.revealLeaf(leaf)
  }



  async activateDualView() {
    const w = this.app.workspace
    let leaf = w.getLeaf(true)
    await leaf.setViewState({ type: VIEW_TYPE_DUAL_SIDEBAR, active: true })
    w.revealLeaf(leaf)
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
