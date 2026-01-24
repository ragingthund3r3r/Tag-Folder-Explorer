<script>
  import {
    getData,
    getFiles,
    addFile,
    rename
  } from './model'

  let data = $state(getData())
  let files = $state(getFiles())
  let newFile = $state('')
  let newName = $state(data.name)

  function refresh() {
    data = getData()
    files = getFiles()
  }

  function onAdd() {
    if (!newFile) return
    addFile(newFile)
    newFile = ''
    refresh()
  }

  function onRename() {
    rename(newName)
    refresh()
  }
</script>

<h2>
  Name:
  <input value={newName} oninput={e => newName = e.target.value} />
  <button onclick={onRename}>rename</button>
</h2>

<p>Count: {data.count}</p>

<ul>
  {#each files as f}
    <li>{f}</li>
  {/each}
</ul>

<input
  placeholder="new file"
  value={newFile}
  oninput={e => newFile = e.target.value}
/>
<button onclick={onAdd}>add file</button>








<!-- <script>
  import { select, getVisibleNodes, getSelection } from './model'

  let nodes = $state(getVisibleNodes())
  let selected = $state(getSelection())

  function onSelect(id) {
    select(id)
    selected = getSelection()
    nodes = getVisibleNodes()
  }
</script>

<ul>
  {#each nodes as n}
    <li>
      <button onclick={() => onSelect(n.id)}>
        {n.name}
      </button>
    </li>
  {/each}
</ul>

<p>Selected: {selected}</p>



----------- -->

