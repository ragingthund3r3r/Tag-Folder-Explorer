<script lang="ts">
  import { writable } from 'svelte/store';
  import TagTreeView from './TagTreeView.svelte';
  import MainView from './MainView.svelte';

  // State for sidebar collapse
  let leftCollapsed = writable(false);
  let rightCollapsed = writable(true);

  // actual variables to maintain state
  let currentPath = $state("")
  function toggleLeft() {
    leftCollapsed.update(v => !v);
  }
  
  function toggleRight() {
    rightCollapsed.update(v => !v);
  }
</script>







<div class="dual-sidebar-container">
  <!-- Left Sidebar -->
  <div class="sidebar left-sidebar" class:collapsed={$leftCollapsed}>
    <div class="sidebar-header">

      <button class="collapse-btn left-btn" onclick={toggleLeft} aria-label="Toggle left sidebar">
        {#if $leftCollapsed}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        {/if}
      </button>           
      
      <span class="sidebar-title left-title"  class:hidden={$leftCollapsed}>Left Sidebar</span>


    </div>
    <div class="sidebar-content" class:hidden={$leftCollapsed}>
      <!-- Left sidebar content - Tag Tree -->
      <TagTreeView />
    </div>
  </div>







  <!-- Main Content Area -->
  <div class="main-content">

    

    <div class="main-header">

      <span class="main-title"><strong style="color: var(--color-base-60);">Vault:/</strong>{currentPath}</span>


    </div>

        <div class="main-subheader">

      <span class="main-subtitle">Main Section Sub</span>


    </div>

    <MainView currentPath={currentPath} />
  </div>







  <!-- Right Sidebar -->
  <div class="sidebar right-sidebar" class:collapsed={$rightCollapsed}>
    <div class="sidebar-header">
      <button class="collapse-btn right-btn" onclick={toggleRight} aria-label="Toggle right sidebar">
        {#if $rightCollapsed}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        {/if}
      </button>
      <span class="sidebar-title right-title"  class:hidden={$rightCollapsed}>Right Sidebar</span>
    </div>
    {#if !$rightCollapsed}
      <div class="sidebar-content">
        <!-- Left sidebar content will go here -->
        <p class="placeholder-text">right sidebar content



            Level the playing field turn the crank time vampire yet critical mass one-sheet we need this overall to be busier and more active are there any leftovers in the kitchen? Organic growth keep it lean, nor best practices dunder mifflin we need to crystallize a plan.

Let's schedule a standup during the sprint to review our kpis who's responsible for the ask for this request? tbrand terrorists, for personal development 4-blocker and blue sky those options are already baked in with this model.

Nail it down execute gain traction, we need distributors to evangelize the new line to local markets cross sabers. On this journey throughput so digitalize, nor note for the previous submit: the devil should be on the left shoulder future-proof prethink.

Move the needle overcome key issues to meet key milestones sacred cow, for locked and loaded, but productize. High-level five-year strategic plan thinking outside the box, yet one-sheet, t-shaped individual nor move the needle, paddle on both sides.

Per my previous email tread it daily. Parallel path synergize productive mindfulness or cannibalize let's see if we can dovetail these two projects rock Star/Ninja, and cross-pollination low-hanging fruit.

Beef up let me know if you need me to crack any skulls and your work on this project has been really impactful, but run it up the flagpole, ping the boss and circle back. Sea change deploy where the metal hits the meat but rock Star/Ninja UI, or low engagement hard stop.


        </p>
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

  .placeholder-text {
    color: var(--text-muted);
    font-size: 14px;
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