<script lang="ts">
  interface Props {
    startCount: number;
  }

  let {
    startCount
  }: Props = $props();

  let count = $state(startCount);

  export function increment() {
    count += 1;
  }

  function handleClick() {
    increment();
  }
</script>

<div class="counter">
  <p class="count-display">Count: {count}</p>
  <button class="increment-btn" onclick={handleClick}>
    Increment
  </button>
</div>

<style>
  .counter {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 16px;
    font-family: var(--font-interface);
  }

  .count-display {
    font-size: 18px;
    font-weight: 500;
    margin: 0;
    color: var(--text-normal);
  }

  .increment-btn {
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .increment-btn:hover {
    background-color: var(--interactive-accent-hover);
  }

  .increment-btn:active {
    background-color: var(--interactive-accent);
    transform: translateY(1px);
  }
</style>
