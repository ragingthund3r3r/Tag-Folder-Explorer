<script lang="ts">
  import { writable } from 'svelte/store';
  import TagTreeView from './TagTreeView.svelte';
  import MainView from './MainView.svelte';
	import MetadataView from './MetadataView.svelte';

  import type {TagFolderPluginSettings} from '../settings';

  import {getVaultName} from '../modelInterface'


 
  let currVaultName  = getVaultName()

  // Props
  interface Props {
    settings?: TagFolderPluginSettings;
  }

  let { settings }: Props = $props();

  // State for sidebar collapse
  let leftCollapsed = $state(false);
  let rightCollapsed = $state(false);

  // actual variables to maintain state
  let currentPath = $state("")
  // let currentPath = writable("")

  // State for currently focused object
  let focusedObjectType = $state<'folder' | 'file' >('folder');
  let focusedObjectPath = $state<string>("");
  let focusedObjectParent = $state<string>("");
  
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
  function handleFocusChange(type: 'folder' | 'file', path: string, parentpath: string) {
    focusedObjectType = type;
    focusedObjectPath = path;
    focusedObjectParent = parentpath
    console.log("__")
    console.log(type)
    console.log(path)
    console.log("__")
  }

  function handleUpdate(newData: string) {
    currentPath = newData;
  }


  function goToParentFolder(){

    let tempCurrPath = currentPath
    let lastSlash = tempCurrPath.lastIndexOf("/");
    let newpath = lastSlash === -1 ? "" : tempCurrPath.slice(0, lastSlash);
    currentPath = newpath

    handleFocusChange('folder', currentPath, tempCurrPath)

  }

  function goToHomeFolder(){

    let tempCurrPath = currentPath
    currentPath = ""

    handleFocusChange('folder', currentPath, tempCurrPath)

  }

  function refreshCurerntFolder(){

    let tempCurrPath = currentPath
    currentPath = ""
    currentPath = tempCurrPath

    handleFocusChange('folder', currentPath, tempCurrPath)

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


      <div class="button-holder">
        <div class="header-button">
          <svg style="padding:2px" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-big-left-icon lucide-arrow-big-left"><path d="M13 9a1 1 0 0 1-1-1V5.061a1 1 0 0 0-1.811-.75l-6.835 6.836a1.207 1.207 0 0 0 0 1.707l6.835 6.835a1 1 0 0 0 1.811-.75V16a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"/></svg>
        </div>
        <div class="header-button">
          <svg style="padding:2px" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-big-right-icon lucide-arrow-big-right"><path d="M11 9a1 1 0 0 0 1-1V5.061a1 1 0 0 1 1.811-.75l6.836 6.836a1.207 1.207 0 0 1 0 1.707l-6.836 6.835a1 1 0 0 1-1.811-.75V16a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"/></svg>
        </div>
      </div>


      <div 
      class="header-button"
      role="button"
      tabindex="0"
      onclick={() => goToHomeFolder()}
      onkeydown={(e) => e.key === 'Enter' && goToHomeFolder()}
      >
        <svg style="padding:2px" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
      </div>



      <div class="path-holder">
        <span class="main-title"><strong style="color: var(--color-base-60);">{currVaultName}:/</strong>{currentPath}</span>
      </div>

      <div 
      class="header-button"
      role="button"
      tabindex="0"
      onclick={() => refreshCurerntFolder()}
      onkeydown={(e) => e.key === 'Enter' && refreshCurerntFolder()}
      >
        <svg style="padding:2px" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw-icon lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
      </div>


      <div 
      class="header-button"
      role="button"
      tabindex="0"
      onclick={() => goToParentFolder()}
      onkeydown={(e) => e.key === 'Enter' && goToParentFolder()}
      >
        <svg style="padding:2px" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-output-icon lucide-folder-output"><path d="M2 7.5V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-1.5"/><path d="M2 13h10"/><path d="m5 10-3 3 3 3"/></svg>
      </div>



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
        <MetadataView  currentPath={currentPath} focusedObjectType={focusedObjectType} focusedObjectPath={focusedObjectPath} focusedObjectParent={focusedObjectParent} showObsMetaData={settings?.showObsMetaData} fieldsToSkip={settings?.fieldsToSkip}/>
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
    scrollbar-gutter: stable;
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
    flex-direction:row;
    align-items: center;
    
    padding: 5px;
    padding-left: 0px;
    padding-right: 0px;
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


.button-holder{
  display: flex;
  flex-direction: row;
  align-items: center; /* vertical centering */

  height: 100%;
  margin-right: 5px;
}

.header-button{
  height: 100%;
  aspect-ratio: 1 / 1; 
  background-color: var(--background-primary-alt);; /* your hex color */
  border-radius: 10px;
  padding:5px;
  margin-left:3px;
  margin-right:3px; 

  display: grid ;
  align-items: center; /* vertical centering */
  place-items: center;

  cursor: pointer;
  transition: background-color 0.2s ease; /* smooth hover */
}


.header-button:hover {
  background-color: var(--background-primary);
  /* or a hex value like #e2e2e2 */
}

.header-button:active {
  transform: scale(0.96);
}
.path-holder{
  flex:1;
  background-color: var(--background-primary-alt);; /* your hex color */
  border-radius: 16px;
  height: 100%;
  display: grid ;
  align-items: center; /* vertical centering */
  padding-left: 10px;
}
  
</style>