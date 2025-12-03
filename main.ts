import { Plugin, ItemView, WorkspaceLeaf } from 'obsidian'

// Import the Counter Svelte component and the `mount` and `unmount` methods.

// step 1
import Counter from './svelte-components/Counter.svelte';
import { mount, unmount } from 'svelte';

 

const VIEW_TYPE_EXPLORER = 'explorer-view'





class ExplorerView extends ItemView {

  // step 2
  counter: ReturnType<typeof Counter> | undefined;

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
    this.counter = mount(Counter, {
      target: this.contentEl,
      props: {
        startCount: 5,
      }
    });
  }


  
  async onClose() {
    if (this.counter) {
      // Remove the Counter from the ItemView.
      unmount(this.counter);
    }


  }
}



export default class ExamplePlugin extends Plugin {
  async onload() {
	
    this.registerView(VIEW_TYPE_EXPLORER, leaf => new ExplorerView(leaf))
    this.addRibbonIcon('dice', 'Open Explorer', () => this.activateView())

  }


  async activateView() {
    const w = this.app.workspace
    
	let leaf = w.getLeaf(true)
	await leaf.setViewState({ type: VIEW_TYPE_EXPLORER, active: true })
    
    w.revealLeaf(leaf)
  }


  
}
