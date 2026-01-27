<script lang="ts">
  import { getmainViewData } from '../modelInterface'
  import type { ISerializedTagNode, frontendFile, frontendFolder } from '../interfaces'
  import { openFileInNewTab } from '../windows'

  // Props
  interface Props {
    currentPath: string;
    onUpdate: (newPath: string) => void;  // Add function signature
    onFocusChange?: (type: 'folder' | 'file', path: string) => void;  // Handler for focus changes
  }


  let { currentPath, onUpdate, onFocusChange }:Props = $props();
  // let { currentPath }: Props = $props();



  let mainViewData: ISerializedTagNode | null = $derived(getmainViewData(currentPath));

  
  // console.log("im tesing ")
  // console.log(mainViewData)
  // console.log(mainViewData?.getChildren())
  // console.log(mainViewData?.getFiles())

  // Track click timeouts to prevent single-click on double-click
  let clickTimeout: number | null = null;
  const CLICK_DELAY = 250; // milliseconds


  function handleFolderDblClick(folder:frontendFolder) {
    // Cancel any pending single-click
    if (clickTimeout !== null) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
    }
 
    let foldername = folder.name
    let folderpath = folder.path
		// console.log('Folder clicked!');
    // console.log(foldername+" "+folderpath)

    onUpdate(folderpath);
    
    // Update focus state when folder is opened
    if (onFocusChange) {
      onFocusChange('folder', folderpath);
    }

    
	}



	function handleFileDblClick(file:frontendFile) {
    // Cancel any pending single-click
    if (clickTimeout !== null) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
    }

		// console.log('File clicked!');
    let filepath = file.path

    // console.log(filepath)
    openFileInNewTab(filepath)
    
    // Update focus state when file is opened
    if (onFocusChange) {
      onFocusChange('file', filepath);
    }
	}



  function handleFolderClick(folder:frontendFolder) {
    // Delay single-click action to check for double-click
    if (clickTimeout !== null) {
      clearTimeout(clickTimeout);
    }
    
    clickTimeout = window.setTimeout(() => {
      let foldername = folder.name
      let folderpath = folder.path
      // console.log('Folder clicked!');
      // console.log(foldername+" "+folderpath)
      
      // Update focus state when folder is opened
      if (onFocusChange) {
        onFocusChange('folder', folderpath);
      }
      
      clickTimeout = null;
    }, CLICK_DELAY);
	}



	function handleFileClick(file:frontendFile) {
    // Delay single-click action to check for double-click
    if (clickTimeout !== null) {
      clearTimeout(clickTimeout);
    }
    
    clickTimeout = window.setTimeout(() => {
      // console.log('File clicked!');
      let filepath = file.path

      
      // Update focus state when file is opened
      if (onFocusChange) {
        onFocusChange('file', filepath);
      }
      
      clickTimeout = null;
    }, CLICK_DELAY);
	}





	function handleKeyDown(event: KeyboardEvent, handler: Function, item: any) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handler(item);
		}
	}

</script>

<div class="main-view-container">


  <div class="main-content-area">

    {#if mainViewData}
      <!-- <pre class="debug-info">{JSON.stringify(mainViewData, null, 2)}</pre> -->
      
    {/if}


<div class="main-view">
  {#if mainViewData}
    <div class="file-grid">
      <!-- Render child folders/tags -->
      {#each mainViewData.children as child}
        <div class="item folder" role="button" tabindex="0" onclick={() => handleFolderClick(child)}  ondblclick={() => handleFolderDblClick(child)} onkeydown={(e) => handleKeyDown(e, handleFolderDblClick, child)}>
          <div class="icon">📁</div>
          <div class="label">{child.name}</div>
        </div>
      {/each}

      <!-- Render files -->
      {#each mainViewData.files as file}
        <div class="item file" role="button" tabindex="0" onclick={() => handleFileClick(file)} ondblclick={() => handleFileDblClick(file)} onkeydown={(e) => handleKeyDown(e, handleFileDblClick, file)}>
          <div class="icon">📄</div>
          <div class="label">{file.name}</div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <p>No data available for this path</p>
    </div>
  {/if}
</div>











  </div>
</div>

<style>
  .main-view-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
  }


  .main-content-area {
    flex: 1;
    overflow: auto;
    min-height: 0;
    padding: 16px;
  }



.file-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill, minmax(120px, 1fr));
  gap:12px;
}

.item{
  /* border:10px solid blue; */
  /* border: 1px solid var(--background-modifier-border); */


  border-radius:6px;
  padding:12px 8px;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:6px;
  cursor:pointer;
  user-select:none;
}

.item:hover{
  /* background:var(--bg-item-hover); */
  background: var(--background-modifier-border);


}

.item:focus{
  outline: 2px solid var(--interactive-accent);
  outline-offset: 2px;
  background: var(--background-modifier-border);
}

.icon{
  font-size:28px;
  line-height:1;
}

.label{
  font-size:13px;
  text-align:center;
  word-break:break-word;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}












</style>
