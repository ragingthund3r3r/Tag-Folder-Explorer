import { App, TFile } from "obsidian";




const app = (window as any).app as App;


// above is okish, but just to be type safe:
// here is a better solution with a custom interface

// interface ObsidianWindow extends Window {
//     app: App;
// }
//
// const app = (window as ObsidianWindow).app;



export async function openFileInNewTab(pathToFile: string) {
 
     

    // Get the file from the vault using the path
    const file = app.vault.getAbstractFileByPath(pathToFile);
    
    // Check if the file exists and is a TFile (not a folder)
    if (file instanceof TFile) {
        // Open the file in a new tab without focusing it (background)
        await app.workspace.getLeaf('tab').openFile(file, { active: false });
        // await app.workspace.getLeaf('tab').openFile(file, { active: true });







        
    }
}