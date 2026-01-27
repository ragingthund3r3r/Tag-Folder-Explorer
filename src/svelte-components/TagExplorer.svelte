<script lang="ts">
  import { writable } from 'svelte/store';
  import TagTreeView from './TagTreeView.svelte';
  import MainView from './MainView.svelte';
	import MetadataView from './MetadataView.svelte';

  // State for sidebar collapse
  let leftCollapsed = $state(false);
  let rightCollapsed = $state(false);

  // actual variables to maintain state
  let currentPath = $state("")
  // let currentPath = writable("")

  // State for currently focused object
  let focusedObjectType = $state<'folder' | 'file' >('folder');
  let focusedObjectPath = $state<string>("");
  
  // focusedObjectPath will store:
  // - Tag path (e.g., "programming/typescript") if focusedObjectType is 'folder'
  // - Physical file path (e.g., "path/to/file.md") if focusedObjectType is 'file'



  function toggleLeft() {
    leftCollapsed = !leftCollapsed;
  }
  
  function toggleRight() {
    rightCollapsed = !rightCollapsed;
  }

  // Handle updates to focused object
  function handleFocusChange(type: 'folder' | 'file', path: string) {
    focusedObjectType = type;
    focusedObjectPath = path;
    console.log("__")
    console.log(type)
    console.log(path)
    console.log("__")
  }

  function handleUpdate(newData: string) {
    currentPath = newData;
  }
</script>







<div class="dual-sidebar-container">
  <!-- Left Sidebar -->
  <div class="sidebar left-sidebar" class:collapsed={leftCollapsed}>
    <div class="sidebar-header">

      <button class="collapse-btn left-btn" onclick={toggleLeft} aria-label="Toggle left sidebar">
        {#if leftCollapsed}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        {/if}
      </button>           
      
      <span class="sidebar-title left-title"  class:hidden={leftCollapsed}>Left Sidebar</span>


    </div>
    <div class="sidebar-content" class:hidden={leftCollapsed}>
      <!-- Left sidebar content - Tag Tree -->
      <TagTreeView currentPath={currentPath}  onUpdate={handleUpdate} onFocusChange={handleFocusChange}  />
    </div>
  </div>







  <!-- Main Content Area -->
  <div class="main-content">

      

    <div class="main-header">

      <span class="main-title"><strong style="color: var(--color-base-60);">Home:/</strong>{currentPath}</span>


    </div>

        <div class="main-subheader">

      <span class="main-subtitle">Main Section Sub</span>


    </div>

    <MainView currentPath={currentPath}  onUpdate={handleUpdate} onFocusChange={handleFocusChange} />
  </div>







  <!-- Right Sidebar -->
  <div class="sidebar right-sidebar" class:collapsed={rightCollapsed}>
    <div class="sidebar-header">
      <button class="collapse-btn right-btn" onclick={toggleRight} aria-label="Toggle right sidebar">
        {#if rightCollapsed}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        {/if}
      </button>
      <span class="sidebar-title right-title"  class:hidden={rightCollapsed}>Right Sidebar</span>
    </div>
    {#if !rightCollapsed}
      <div class="sidebar-content">
        <!-- Left sidebar content will go here --> 
        <MetadataView  currentPath={currentPath} focusedObjectType={focusedObjectType} focusedObjectPath={focusedObjectPath}/>
      </div>
    {/if}
  </div>
</div>












<style>
  .dual-sidebar-container {
    display: flex;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    background-color: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    transition: width 0.2s ease;
    flex-shrink: 0;
  }

  .left-sidebar {
    width: 250px;
    border-right: 1px solid var(--background-modifier-border);
  }

  .right-sidebar {
    width: 250px;
    border-left: 1px solid var(--background-modifier-border);
  }

  .sidebar.collapsed {
    width: 40px;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    
    padding: 8px;
    border-bottom: 1px solid var(--background-modifier-border);
    background-color: var(--background-secondary-alt);
    min-height: 40px;
  }

  .left-sidebar .sidebar-header {
    flex-direction: row;
  }

  .right-sidebar .sidebar-header {
    flex-direction: row-reverse;
  }

  .sidebar-title {
    font-weight: 500;
    font-size: 14px;
    color: var(--text-normal);
    white-space: nowrap;
    overflow: hidden;
  }

  .collapsed .sidebar-title {
    display: none;
  }

  .collapse-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    border-radius: 4px;
  }

  .collapse-btn:hover {
    background-color: var(--background-modifier-hover);
    color: var(--text-normal);
  }

  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding-left: 5px;
    padding-right: 5px;
    background-color: var(--background-primary);
    min-height: 0;
  }


  .hidden {
    display: none;
  }

  .left-btn{
    margin-right: auto;
  }
  .left-title{
    margin-left: auto;
  }  




  .right-btn{
    margin-left: auto;
  }
  .right-title{
    margin-right: auto;
  }  





   .main-title {
    font-weight: 500;
    font-size: 14px;
    color: var(--text-normal);
    white-space: nowrap;
    overflow: hidden;
  }


   .main-subtitle {
    font-weight: 500;
    font-size: 14px;
    color: var(--text-normal);
    white-space: nowrap;
    overflow: hidden;
  }


  .main-header {
    display: flex;
    align-items: center;
    
    padding: 8px;
    border-bottom: 1px solid var(--background-modifier-border);
    background-color: var(--background-secondary-alt);
    min-height: 40px;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .main-subheader {
    display: flex;
    align-items: center;
    
    padding: 8px;
    border-bottom: 1px solid var(--background-modifier-border);
    background-color: var(--background-primary-alt);
    min-height: 40px;
    position: sticky;
    top: 40px;
    z-index: 9;
  }

  
</style>