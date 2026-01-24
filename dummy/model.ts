type Data = {
  name: string
  files: string[]
  count: number
}

let data: Data

export function initModel(d: Data) {
  data = d
}

/* READS */

export function getData() {
  return data
}

export function getFiles() {
  return data.files
}

/* MUTATIONS */

export function addFile(name: string) {
  data.files.push(name)
  data.count = data.files.length
}

export function rename(newName: string) {
  data.name = newName
}






// type Node = {
//   id: string
//   name: string
//   children?: Node[]
// }

// const tree: Node = {
//   id: 'root',
//   name: 'Root',
//   children: [
//     { id: 'a', name: 'A' },
//     { id: 'b', name: 'B' }
//   ]
// }

// let selectedId: string | null = null

// export function select(id: string) {
//   selectedId = id
// }

// export function getVisibleNodes() {
//   if (!selectedId) return tree.children ?? []
//   return tree.children?.filter(n => n.id === selectedId) ?? []
// }

// export function getSelection() {
//   return selectedId
// }




// ------------------------

