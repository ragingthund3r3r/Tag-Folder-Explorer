<script lang="ts">
  import { getmainViewData } from '../modelInterface'
  import type { ISerializedTagNode, frontendFile, frontendFolder } from '../interfaces'
  

  // Props
  interface Props {
    currentPath: string;
    onUpdate: (newPath: string) => void;  // Add function signature
  }


  let { currentPath, onUpdate }:Props = $props();
  // let { currentPath }: Props = $props();



  let mainViewData: ISerializedTagNode | null = $derived(getmainViewData(currentPath));

  
  // console.log("im tesing ")
  // console.log(mainViewData)
  // console.log(mainViewData?.getChildren())
  // console.log(mainViewData?.getFiles())


  function handleFolderClick(folder:frontendFolder) {

 
    let foldername = folder.name
    let folderpath = folder.path
		// console.log('Folder clicked!');
    // console.log(foldername+" "+folderpath)

    onUpdate(folderpath);

    
	}



	function handleFileClick(file:frontendFile) {

		console.log('File clicked!');
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
        <div class="item folder" role="button" tabindex="0" onclick={() => handleFolderClick(child)} onkeydown={(e) => handleKeyDown(e, handleFolderClick, child)}>
          <div class="icon">📁</div>
          <div class="label">{child.name}</div>
        </div>
      {/each}

      <!-- Render files -->
      {#each mainViewData.files as file}
        <div class="item file" role="button" tabindex="0" onclick={() => handleFileClick(file)} onkeydown={(e) => handleKeyDown(e, handleFileClick, file)}>
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

  .placeholder-text {
    color: var(--text-muted);
    font-size: 14px;
    margin-bottom: 16px;
  }

  .debug-info {
    background-color: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    padding: 12px;
    font-size: 12px;
    overflow-x: auto;
    color: var(--text-normal);
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
