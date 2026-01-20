import {App, PluginSettingTab, Setting} from "obsidian";
import TagFolderPlugin from "./main";

export interface TagFolderPluginSettings {
	folderPathsToSkip: string;
}

export const DEFAULT_SETTINGS: TagFolderPluginSettings = {
	folderPathsToSkip: 'default'
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
	}
}