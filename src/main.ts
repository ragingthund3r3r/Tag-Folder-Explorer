import { Plugin } from 'obsidian';
import { TreeRoot } from './TreeRoot';

export default class TagFolderPlugin extends Plugin {
	private treeRoot: TreeRoot | null = null;

	async onload() {
		console.log('Tag Folder Plugin loaded');
		
		// Construct the tag tree structure
		this.treeRoot = new TreeRoot(this.app);
		
		console.log('Tag tree constructed successfully');

  

		var temp = this.treeRoot.getSortedTree()
		console.log(temp)
	}

	onunload() {
		console.log('Tag Folder Plugin unloaded');
		
		// Clean up the tree reference
		this.treeRoot = null;
	}
}
