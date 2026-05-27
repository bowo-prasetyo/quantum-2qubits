import { router } from './router.js';
import * as db from './db.js';

window.db = db;

const app = Vue.createApp({
  template: `<router-view />`
});

app.use(router);
app.mount('#app');
