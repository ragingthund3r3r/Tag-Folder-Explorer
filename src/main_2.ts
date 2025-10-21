
import { Plugin } from 'obsidian'; 
import { testFileLeaf } from '../tests/testFileLeaf';


export default class TagFileExplorerPluginDev extends Plugin { 
	async onload() { 
		// Your development code goes here 
		console.log('Tag File Explorer Plugin Dev loaded'); 
		
		// Run FileLeaf tests
		await testFileLeaf(this.app);
	} 
		
	onunload() { 
		// Your cleanup code goes here 
		console.log('Tag File Explorer Plugin Dev unloaded'); 
	} 
}