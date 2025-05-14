import { RenderControls } from './components/Controls.js';
import { RenderTaskList } from './components/TaskList.js';
import { store, app } from './variables/toMain.js';
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}
app.appendChild(RenderControls.main(store));
app.appendChild(RenderTaskList.main(store));