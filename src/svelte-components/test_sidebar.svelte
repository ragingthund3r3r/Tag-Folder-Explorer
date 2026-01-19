<script lang="ts">
  // Sample file tree data structure
  interface FileItem {
    name: string;
    path: string;
    type: 'file' | 'folder';
    children?: FileItem[];
  }

  // Sample data - mimics a vault structure
  let fileTree: FileItem[] = [
    {
      name: 'Projects',
      path: 'Projects',
      type: 'folder',
      children: [
        { name: 'Project Alpha', path: 'Projects/Project Alpha.md', type: 'file' },
        { name: 'Project Beta', path: 'Projects/Project Beta.md', type: 'file' },
        {
          name: 'Archives',
          path: 'Projects/Archives',
          type: 'folder',
          children: [
            { name: 'Old Project', path: 'Projects/Archives/Old Project.md', type: 'file' }
          ]
        }
      ]
    },
    {
      name: 'Daily Notes',
      path: 'Daily Notes',
      type: 'folder',
      children: [
        { name: '2024-01-15', path: 'Daily Notes/2024-01-15.md', type: 'file' },
        { name: '2024-01-16', path: 'Daily Notes/2024-01-16.md', type: 'file' }
      ]
    },
    { name: 'Welcome', path: 'Welcome.md', type: 'file' },
    { name: 'Getting Started', path: 'Getting Started.md', type: 'file' },
    { name: 'README', path: 'README.md', type: 'file' }
  ];

  // Track expanded folders and selected file
  let expandedFolders = $state<Set<string>>(new Set(['Projects', 'Daily Notes']));
  let selectedFile = $state<string | null>('Welcome.md');

  function toggleFolder(path: string) {
    if (expandedFolders.has(path)) {
      expandedFolders.delete(path);
    } else {
      expandedFolders.add(path);
    }
    expandedFolders = new Set(expandedFolders); // trigger reactivity
  }

  function selectFile(path: string) {
    selectedFile = path;
    console.log('Selected file:', path);
  }

  function isExpanded(path: string): boolean {
    return expandedFolders.has(path);
  }
</script>

<!-- File Explorer using Obsidian's native CSS classes -->
<div class="nav-header">
  <div class="nav-buttons-container">
    <!-- New Note Button -->
    <div class="clickable-icon nav-action-button" aria-label="New note">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-edit">
        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
      </svg>
    </div>
    
    <!-- New Folder Button -->
    <div class="clickable-icon nav-action-button" aria-label="New folder">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-folder-plus">
        <path d="M12 10v6"></path>
        <path d="M9 13h6"></path>
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
      </svg>
    </div>
    
    <!-- Sort Button -->
    <div class="clickable-icon nav-action-button" aria-label="Change sort order">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-sort-asc">
        <path d="m3 8 4-4 4 4"></path>
        <path d="M7 4v16"></path>
        <path d="M11 12h4"></path>
        <path d="M11 16h7"></path>
        <path d="M11 20h10"></path>
      </svg>
    </div>
    
    <!-- Collapse All Button -->
    <div class="clickable-icon nav-action-button" aria-label="Collapse all">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-chevrons-down-up">
        <path d="m7 20 5-5 5 5"></path>
        <path d="m7 4 5 5 5-5"></path>
      </svg>
    </div>
  </div>
</div>

<div class="nav-files-container node-insert-event">
  {#each fileTree as item}
    {#if item.type === 'folder'}
      <!-- Folder Item -->
      <div class="tree-item nav-folder" class:is-collapsed={!isExpanded(item.path)}>
        <div 
          class="tree-item-self nav-folder-title is-clickable mod-collapsible"
          data-path={item.path}
          role="button"
          tabindex="0"
          onclick={() => toggleFolder(item.path)}
          onkeydown={(e) => e.key === 'Enter' && toggleFolder(item.path)}
        >
          <div class="tree-item-icon collapse-icon" class:is-collapsed={!isExpanded(item.path)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon right-triangle">
              <path d="M3 8L12 17L21 8"></path>
            </svg>
          </div>
          <div class="tree-item-inner nav-folder-title-content">{item.name}</div>
        </div>
        
        {#if isExpanded(item.path) && item.children}
          <div class="tree-item-children nav-folder-children">
            {#each item.children as child}
              {#if child.type === 'folder'}
                <!-- Nested Folder -->
                <div class="tree-item nav-folder" class:is-collapsed={!isExpanded(child.path)}>
                  <div 
                    class="tree-item-self nav-folder-title is-clickable mod-collapsible"
                    data-path={child.path}
                    role="button"
                    tabindex="0"
                    onclick={() => toggleFolder(child.path)}
                    onkeydown={(e) => e.key === 'Enter' && toggleFolder(child.path)}
                  >
                    <div class="tree-item-icon collapse-icon" class:is-collapsed={!isExpanded(child.path)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon right-triangle">
                        <path d="M3 8L12 17L21 8"></path>
                      </svg>
                    </div>
                    <div class="tree-item-inner nav-folder-title-content">{child.name}</div>
                  </div>
                  
                  {#if isExpanded(child.path) && child.children}
                    <div class="tree-item-children nav-folder-children">
                      {#each child.children as grandchild}
                        <div class="tree-item nav-file">
                          <div 
                            class="tree-item-self nav-file-title tappable is-clickable"
                            class:is-active={selectedFile === grandchild.path}
                            data-path={grandchild.path}
                            role="button"
                            tabindex="0"
                            onclick={() => selectFile(grandchild.path)}
                            onkeydown={(e) => e.key === 'Enter' && selectFile(grandchild.path)}
                          >
                            <div class="tree-item-inner nav-file-title-content">{grandchild.name}</div>
                          </div>
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>
              {:else}
                <!-- Child File -->
                <div class="tree-item nav-file">
                  <div 
                    class="tree-item-self nav-file-title tappable is-clickable"
                    class:is-active={selectedFile === child.path}
                    data-path={child.path}
                    role="button"
                    tabindex="0"
                    onclick={() => selectFile(child.path)}
                    onkeydown={(e) => e.key === 'Enter' && selectFile(child.path)}
                  >
                    <div class="tree-item-inner nav-file-title-content">{child.name}</div>
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        {/if}
      </div>
    {:else}
      <!-- Root Level File -->
      <div class="tree-item nav-file">
        <div 
          class="tree-item-self nav-file-title tappable is-clickable"
          class:is-active={selectedFile === item.path}
          data-path={item.path}
          role="button"
          tabindex="0"
          onclick={() => selectFile(item.path)}
          onkeydown={(e) => e.key === 'Enter' && selectFile(item.path)}
        >
          <div class="tree-item-inner nav-file-title-content">{item.name}</div>
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  /* 
   * This component uses Obsidian's built-in CSS classes.
   * The styles here are minimal overrides to ensure proper display
   * when rendered inside a view rather than the actual sidebar.
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
</style>