<script lang="ts">
  import { getmainViewData, treeReady } from '../modelInterface'
  import type { ISerializedTagNode } from '../interfaces'
  

  // Props
  interface Props {
    currentPath: string;
  }

  let { currentPath }: Props = $props();

  // Track tree ready state to trigger reactivity
  let treeVersion = $state(0);
  
  // Subscribe to tree updates - refresh when tree becomes ready
  $effect(() => {
    treeVersion = $treeReady;
  });

  // Fetch data based on current path (also reacts to treeVersion changes)
  let mainViewData: ISerializedTagNode | null = $derived.by(() => {
    // Reference treeVersion to make this reactive to tree updates
    const _ = treeVersion;
    return getmainViewData(currentPath);
  });
  
  // console.log("im tesing ")
  // console.log(mainViewData)
  // console.log(mainViewData?.getChildren())
  // console.log(mainViewData?.getFiles())

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
      {#each mainViewData.children as childName}
        <div class="item folder">
          <div class="icon">📁</div>
          <div class="label">{childName}</div>
        </div>
      {/each}

      <!-- Render files -->
      {#each mainViewData.files as fileName}
        <div class="item file">
          <div class="icon">📄</div>
          <div class="label">{fileName}</div>
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
  background:var(--bg-item);
  border:1px solid var(--border-subtle);
  /* border:10px solid blue; */

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
  background:var(--bg-item-hover);
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
