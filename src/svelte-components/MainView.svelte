<script lang="ts">
  import { getmainViewData } from '../modelInterface'
  

  // Props
  interface Props {
    currentPath: string;
  }

  let { currentPath }: Props = $props();

  // Fetch data based on current path
  let mainViewData = $derived(getmainViewData(currentPath))
  
  // console.log("im tesing ")
  // console.log(mainViewData)
  // console.log(mainViewData?.getChildren())
  // console.log(mainViewData?.getFiles())

</script>

<div class="main-view-container">


  <div class="main-content-area">
    <p class="placeholder-text">Main content area</p>
    {#if mainViewData}
      <pre class="debug-info">{mainViewData}</pre>
      
    {/if}

  </div>
</div>

<style>
  .main-view-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }


  .main-content-area {
    flex: 1;
    overflow-y: auto;
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
</style>
