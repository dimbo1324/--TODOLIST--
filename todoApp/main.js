import { renderControls } from './components/Controls.js';
import { renderTaskList } from './components/TaskList.js';
import { store, app } from './variables/toMain.js';

app.appendChild(renderControls(store));
app.appendChild(renderTaskList(store));
