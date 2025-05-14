import { renderControls } from './components/Controls.js';
import { renderTaskList } from './components/TaskList.js';
import { store, app } from './variables/toMain.js';
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}
app.appendChild(renderControls(store));
app.appendChild(renderTaskList(store));