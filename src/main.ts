import { Plugin } from 'obsidian';

export default class TagFolderPlugin extends Plugin {
	async onload() {
		console.log('Tag Folder Plugin loaded');
	}

	onunload() {
		console.log('Tag Folder Plugin unloaded');
	}
}
