import { router } from './router.js';
import * as db from './db.js';

window.db = db;

const app = Vue.createApp({
  template: `<router-view />`
});

// Bind global variables or functions
app.config.globalProperties.$globalThis = globalThis

app.use(router);
app.mount('#app');
