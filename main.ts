import { Plugin, ItemView, WorkspaceLeaf } from 'obsidian'

// Import the Counter Svelte component and the `mount` and `unmount` methods.

// step 1
import Counter from './svelte-components/Counter.svelte';
import testsidebar from './svelte-components/test_sidebar.svelte';
import DualSidebar from './svelte-components/DualSidebar.svelte';

import { mount, unmount } from 'svelte';

 

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


export default class ExamplePlugin extends Plugin {
  async onload() {
	
    this.registerView(VIEW_TYPE_EXPLORER, leaf => new ExplorerView(leaf))
    this.registerView(VIEW_TYPE_DUAL_SIDEBAR, leaf => new DualSidebarView(leaf))


    this.addRibbonIcon('dice', 'Open Explorer', () => this.activateView())
    this.addRibbonIcon('folder-tree', 'Open Dual Sidebar', () => this.activateDualView())

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
  
}
