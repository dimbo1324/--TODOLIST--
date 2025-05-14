import { initStore } from './store/todoStore.js';
import { renderControls } from './components/Controls.js';
import { renderTaskList } from './components/TaskList.js';
const store = initStore();
const app = document.getElementById('app');
app.appendChild(renderControls(store));
app.appendChild(renderTaskList(store));
