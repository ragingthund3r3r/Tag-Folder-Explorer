import {App, PluginSettingTab, Setting} from "obsidian";
import TagFolderPlugin from "./main";

export interface TagFolderPluginSettings {
	folderPathsToSkip: string;
	showObsMetaData: boolean;
	fieldsToSkip: string;

}

export const DEFAULT_SETTINGS: TagFolderPluginSettings = {
	folderPathsToSkip: '',
	showObsMetaData: false,
	fieldsToSkip: ''
}

export class TagFolderSettingTab extends PluginSettingTab {
	plugin: TagFolderPlugin;

	constructor(app: App, plugin: TagFolderPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		const setting = new Setting(containerEl)
			.setName('Folders to skip in tree')
			.addTextArea(text => text
				.setPlaceholder('Folder Paths')
				.then(t => {
				const control = t.inputEl.closest('.setting-item-control');
				if (control instanceof HTMLElement) {
					control.style.flex = '0 0 40%';
				}
				t.inputEl.style.width = '100%';
				t.inputEl.style.minHeight = '100px';
  				t.inputEl.style.resize = 'vertical';
				})
				.setValue(this.plugin.settings.folderPathsToSkip)
				.onChange(async (value) => {
					this.plugin.settings.folderPathsToSkip = value;
					await this.plugin.saveSettings();
				}));
		
		setting.descEl.innerHTML = 'These are physical folders in your vault that you dont want to be indexed and included in the Tag-tree.<br><br>Enter each folder path on a new line<br><br> For eg:<br>Subject/Maths<br>Personal/Journal';


		const showObsMetaData  = new Setting(containerEl)
			.setName('Show the Metadata Created by Obsidian ')
			.setDesc('Toggle to show or hide Obsidian-created metadata')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showObsMetaData)
				.onChange(async (value) => {
					this.plugin.settings.showObsMetaData = value;
					await this.plugin.saveSettings();
				}));

		const fieldsToSkip = new Setting(containerEl)
			.setName('Metadata fields to skip while rendering sidebar')
			.addTextArea(text => text
				.setPlaceholder('Metadata fields')
				.then(t => {
				const control = t.inputEl.closest('.setting-item-control');
				if (control instanceof HTMLElement) {
					control.style.flex = '0 0 40%';
				}
				t.inputEl.style.width = '100%';
				t.inputEl.style.minHeight = '100px';
  				t.inputEl.style.resize = 'vertical';
				})
				.setValue(this.plugin.settings.fieldsToSkip)
				.onChange(async (value) => {
					this.plugin.settings.fieldsToSkip = value;
					await this.plugin.saveSettings();
				}));
		
		fieldsToSkip.descEl.innerHTML = 'These are metadata fields in your files that you dont want to render in the Metadata Sidebar.<br><br>Enter each metadata field on a new line<br><br> For eg:<br>tags<br>assigned<br>category';


	}
}