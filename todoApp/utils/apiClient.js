const API_URL = 'http://localhost:3000';
export async function fetchTasks() {
    const response = await fetch(`${API_URL}/tasks`);
    return response.json();
}
export async function addTask(title) {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });
    return response.json();
}
export async function updateTask(id, completed) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
    });
    return response.json();
}
export async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
    });
}
export async function fetchSubtasks(taskId) {
    const response = await fetch(`${API_URL}/tasks/${taskId}/subtasks`);
    return response.json();
}
export async function addSubtask(taskId, title) {
    const response = await fetch(`${API_URL}/tasks/${taskId}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });
    return response.json();
}
export async function deleteSubtask(id) {
    await fetch(`${API_URL}/subtasks/${id}`, {
        method: 'DELETE',
    });
}
