import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { initModel } from './model'

const data = {
  name: 'temp',
  files: ['a.md', 'b.md', 'c.md'],
  count: 3
}

initModel(data)

const app = mount(App, {
  target: document.getElementById('app')!
})

export default app






// import { mount } from 'svelte'
// import './app.css'
// import App from './App.svelte'





// const app = mount(App, {
//   target: document.getElementById('app')!,
// })

// export default app



// // const data = {
// //   name: 'temp',
// //   files: ['a.md', 'b.md', 'c.md'],
// //   count: 3
// // }


// // const app = mount(App, {
// //   target: document.getElementById('app')!,
// //   props: { data },
// // })

// // export default app




// ------------------


