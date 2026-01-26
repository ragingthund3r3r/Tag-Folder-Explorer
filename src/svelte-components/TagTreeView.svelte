<script lang="ts">
  import { getleftSidebarTree} from '../modelInterface'
  import type { frontendFile, frontendFolder } from '../interfaces'

  import { openFileInNewTab } from '../windows'

  // Props
  interface Props {
    currentPath: string;
    onUpdate: (newPath: string) => void;  // Add function signature
  }
  
  // Type definitions
  interface FileData {
    name: string;
    path: string;
    tagpath: string;
  }

  interface TagNodeData {
    name: string;
    path: string;
    children: TagNodeData[];
    files: FileData[];
    totalFileCount: number;
  }

  interface TreeData {
    rootTags: TagNodeData[];
    untaggedFiles: FileData[];
  }

  // State
  let treeData = $state<TreeData>(getleftSidebarTree() as TreeData)
  let expandedTags = $state<Set<string>>(new Set())
  let selectedFile = $state<string | null>(null)


  let { currentPath, onUpdate }:Props = $props();

  treeData = getleftSidebarTree() as TreeData;


  function toggleTag(path: string) {
    if (expandedTags.has(path)) {
      expandedTags.delete(path);
    } else {
      expandedTags.add(path);
    }
    expandedTags = new Set(expandedTags); // trigger reactivity
  }

  function selectFile(path: string) {
    selectedFile = path;
    console.log('Selected file:', path);
  }

  function isExpanded(path: string): boolean {
    return expandedTags.has(path);
  }

  function handleFolderClick(folder:string) {

 
    let folderpath = folder
		// console.log('Folder clicked!');
    // console.log(foldername+" "+folderpath)

    onUpdate(folderpath);

    
	}

  function handleFileClick(file:string) {

		// console.log('File clicked!');
    let filepath = file

    // console.log(filepath)
    openFileInNewTab(filepath)
	}




</script>

{#snippet renderTagNode(node: TagNodeData)}
  <!-- Tag/Folder Item using Obsidian's native classes -->
  <div class="tree-item nav-folder" class:is-collapsed={!isExpanded(node.path)}>
    <div 
      class="tree-item-self nav-folder-title is-clickable mod-collapsible"
      data-path={node.path}
    >
      <div 
        class="tree-item-icon collapse-icon is-clickable" 
        class:is-collapsed={!isExpanded(node.path)}
        role="button"
        tabindex="0"
        onclick={() => toggleTag(node.path)}
        onkeydown={(e) => e.key === 'Enter' && toggleTag(node.path)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon right-triangle">
          <path d="M3 8L12 17L21 8"></path>
        </svg>
      </div>
      <div 
        class="tree-item-inner nav-folder-title-content"
        role="button"
        tabindex="0"
        onclick={() => handleFolderClick(node.path)}
        onkeydown={(e) => e.key === 'Enter' && handleFolderClick(node.path)}
      >{node.name}</div>
      <div class="tree-item-flair-outer">
        <span class="tree-item-flair">{node.totalFileCount}</span>
      </div>
    </div>
    
    {#if isExpanded(node.path)}
      <div class="tree-item-children nav-folder-children">
        <!-- Render files in this tag -->
        {#if node.files && node.files.length > 0}
          {#each node.files as file}
            <div class="tree-item nav-file">
              <div 
                class="tree-item-self nav-file-title tappable is-clickable"
                class:is-active={selectedFile === file.path}
                data-path={file.path}
                role="button"
                tabindex="0"
                onclick={() => handleFileClick(file.path)}
                onkeydown={(e) => e.key === 'Enter' && handleFileClick(file.path)}
              >
                <div class="tree-item-inner nav-file-title-content">{file.name}</div>
              </div>
            </div>
          {/each}
        {/if}
        
        <!-- Render child tags -->
        {#if node.children && node.children.length > 0}
          {#each node.children as child}
            {@render renderTagNode(child)}
          {/each}
        {/if}
      </div>
    {/if}
  </div>
{/snippet}

<!-- Tag Tree using Obsidian's native classes -->
{#if treeData && treeData.rootTags}
  <div class="nav-files-container node-insert-event">
    {#each treeData.rootTags as tagNode}
      {@render renderTagNode(tagNode)}
    {/each}
    
    {#if treeData.untaggedFiles && treeData.untaggedFiles.length > 0}
      <!-- Untagged Files as a special folder -->
      <div class="tree-item nav-folder" class:is-collapsed={!isExpanded('__untagged__')}>
        <div 
          class="tree-item-self nav-folder-title is-clickable mod-collapsible"
          data-path="__untagged__"
          role="button"
          tabindex="0"
          onclick={() => toggleTag('__untagged__')}
          onkeydown={(e) => e.key === 'Enter' && toggleTag('__untagged__')}
        >
          <div class="tree-item-icon collapse-icon" class:is-collapsed={!isExpanded('__untagged__')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon right-triangle">
              <path d="M3 8L12 17L21 8"></path>
            </svg>
          </div>
          <div class="tree-item-inner nav-folder-title-content">Untagged Files</div>
          <div class="tree-item-flair-outer">
            <span class="tree-item-flair">{treeData.untaggedFiles.length}</span>
          </div>
        </div>
        
        {#if isExpanded('__untagged__')}
          <div class="tree-item-children nav-folder-children">
            {#each treeData.untaggedFiles as file}
              <div class="tree-item nav-file">
                <div 
                  class="tree-item-self nav-file-title tappable is-clickable"
                  class:is-active={selectedFile === file.path}
                  data-path={file.path}
                  role="button"
                  tabindex="0"
                  onclick={() => selectFile(file.path)}
                  onkeydown={(e) => e.key === 'Enter' && selectFile(file.path)}
                >
                  <div class="tree-item-inner nav-file-title-content">{file.name}</div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
{:else}
  <p class="placeholder-text">No tags found</p>
{/if}

<style>
  /* 
   * Obsidian native CSS classes are used for tree rendering.
   * Minimal overrides to ensure proper display in custom view.
   */
  
  .nav-files-container {
    padding: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  /* Ensure the collapse icon rotates properly */
  .collapse-icon.is-collapsed {
    transform: rotate(-90deg);
  }
  
  .collapse-icon {
    transition: transform 100ms ease-in-out;
  }

  .placeholder-text {
    color: var(--text-muted);
    font-size: 14px;
    padding: 12px;
  }
</style>
