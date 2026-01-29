<script lang="ts">

  import { getrightSidebarData } from '../modelInterface'

    // Props
    interface Props {
        currentPath: string;
        focusedObjectType: string ;
        focusedObjectPath: string ;
        focusedObjectParent: string ;
    }


    let { currentPath, focusedObjectType, focusedObjectPath, focusedObjectParent}:Props = $props();
    
    
    let metadataViewData: any | null = $derived(getrightSidebarData(focusedObjectParent, focusedObjectType, focusedObjectPath));
 
    function formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    function parseLegend(legendText: string): Array<{emoji: string, label: string}> {
        if (!legendText) return [];
        const lines = legendText.trim().split('\n');
        return lines
            .filter(line => line.trim().startsWith('-'))
            .map(line => {
                const match = line.match(/- ([^,]+),\s*(.+)/);
                if (match) {
                    return { emoji: match[1].trim(), label: match[2].trim() };
                }
                return null;
            })
            .filter(item => item !== null) as Array<{emoji: string, label: string}>;
    }

    function formatTimestamp(timestamp: number): string {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    function formatFieldName(fieldName: string): string {
        // Convert field names like "modified" to "Modified"
        return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    }


</script>


{#if focusedObjectType == 'folder'}
    {#if metadataViewData.name== "" }
    <div class="metadata-container">
        
        <div class="folder-image-container">
        <svg
            class="folder-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--interactive-accent)"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
        </div>


        <div class="metadata-section">
        
            <div class="metadata-field">
                <span class="field-label">Name:</span>
                <span class="field-value">Home</span>
            </div>
            
            <div class="metadata-field">
                <span class="field-label">Path:</span>
                <span class="field-value path">/</span>
            </div>

        </div>

    </div>
    {:else}
        {#if metadataViewData}
        <div class="metadata-container">

            <div class="folder-image-container">
            <svg
                class="folder-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--interactive-accent)"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            </div>


            <div class="metadata-section">
            
                <div class="metadata-field">
                    <span class="field-label">Name:</span>
                    <span class="field-value">{metadataViewData.name || 'N/A'}</span>
                </div>
                
                <div class="metadata-field">
                    <span class="field-label">Path:</span>
                    <span class="field-value path">{metadataViewData.path || 'N/A'}</span>
                </div>

                <div class="metadata-field">
                    <span class="field-label">Created:</span>
                    <span class="field-value">{formatDate(metadataViewData.created)}</span>
                </div>
                
                <div class="metadata-field">
                    <span class="field-label">Modified:</span>
                    <span class="field-value">{formatDate(metadataViewData.modified)}</span>
                </div>


            </div>



            {#if metadataViewData.description}
            <div class="metadata-section">
                <h5 class="metadata-title">Description</h5>
                <div class="description-text">
                    {metadataViewData.description}
                </div>
            </div>
            {/if}

            {#if metadataViewData.legend}
            <div class="metadata-section">
                <h5 class="metadata-title">Legend</h5>
                <div class="legend-list">
                    {#each parseLegend(metadataViewData.legend) as item}
                        <div class="legend-item">
                            <span class="legend-emoji">{item.emoji}</span>
                            <span class="legend-label">{item.label}</span>
                        </div>
                    {/each}
                </div>
            </div>
            {/if}
        </div>
        {:else}
        <div class="empty-state">
            <p>No metadata available</p>
        </div>
        {/if}

    {/if}
{/if}



{#if focusedObjectType == 'file'}
    {#if metadataViewData}
    <div class="metadata-container">  
      
        <div class="folder-image-container">
        <svg
            class="folder-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--interactive-accent)"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/>
        </svg>


        
        </div>

      {#if metadataViewData.filemetadata && Object.keys(metadataViewData.filemetadata).length > 0}
      <div class="metadata-section">
          <h5 class="metadata-title">File Metadata</h5>
          {#each Object.entries(metadataViewData.filemetadata) as [key, value]}
              <div class="metadata-field">
                  <span class="field-label">{formatFieldName(key)}:</span>
                  <span class="field-value">{value || 'N/A'}</span>
              </div>
          {/each}
      </div>
      {/if}

      {#if metadataViewData.fileinitial}
      <div class="metadata-section">
          <h5 class="metadata-title">File Content</h5>
          <div class="description-text">
              {metadataViewData.fileinitial}  
          </div>
      </div>
      {/if}

      {#if metadataViewData.fileobsdata}
      <div class="metadata-section">
          <h5 class="metadata-title">Obsidian Information</h5>
          <div class="metadata-field">
              <span class="field-label">Created Time:</span>
              <span class="field-value">{formatTimestamp(metadataViewData.fileobsdata.ctime)}</span>
          </div>
          <div class="metadata-field">
              <span class="field-label">Modified Time:</span>
              <span class="field-value">{formatTimestamp(metadataViewData.fileobsdata.mtime)}</span>
          </div>
      </div>
      {/if}
  </div>
    {:else}
        <div class="empty-state">
            <p>No file data available</p>
        </div>
    {/if}
{/if}




<style>

  .metadata-container {
    padding: 8px;
    color: var(--text-normal);
  }

  .folder-image-container {
    width: 80%;
    aspect-ratio: 1 / 1;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--background-secondary) 0%, var(--background-primary) 100%);
    border-radius: 8px;
    padding: 20px;
    box-sizing: border-box;
  }

  .folder-icon {
    width: 100%;
    height: 100%;
    max-width: 200px;
    max-height: 200px;
  }

  .metadata-section {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .metadata-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .metadata-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-normal);
    margin: 0 0 12px 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .metadata-field {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 4px;
    gap: 12px;
  }

  .field-label {
    font-size: 13px;
    color: var(--text-muted);
    font-weight: 500;
    flex-shrink: 0;
  }

  .field-value {
    font-size: 13px;
    color: var(--text-normal);
    text-align: right;
    word-break: break-word;
  }

  .field-value.path {
    font-family: var(--font-monospace);
    font-size: 12px;
  }

  .description-text {
    background-color: var(--background-secondary);
    border-radius: 4px;
    font-size: 13px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: var(--text-normal);
  }

  .legend-list {
    display: flex;
    flex-direction: column;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 2px 10px;
    background-color: var(--background-secondary);
    border-radius: 4px;
    font-size: 13px;
  }

  .legend-emoji {
    font-size: 18px;
    flex-shrink: 0;
  }

  .legend-label {
    color: var(--text-normal);
  }

  .empty-state {
    padding: 32px 16px;
    text-align: center;
    color: var(--text-muted);
    font-size: 13px;
  }


</style>