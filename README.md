# TODO Full-Stack Application

**Репозиторий содержит**:

```
--TODOLIST--                   # Корневая папка
├─ todoApp/                    # Front-End (Vanilla JS)
├─ todoBackend/                # Back-End (Express + PostgreSQL)
├─ todoDb/                     # SQL-дамп и скрипты БД
├─ .gitignore
└─ README.md
```

---

## 📂 Структура проекта

### 1. Front-End (`todoApp/`)

```
todoApp/
├─ index.html                 # Точка входа
├─ styles.css                 # Стили приложения
├─ main.js                    # ES6-модули: инициализация app
├─ components/                # UI‑компоненты
│  ├─ Controls.js             # Класс RenderControls
│  ├─ TaskList.js             # Класс RenderTaskList
│  └─ SubtaskItem.js          # Функция renderSubtaskItem
├─ models/                    # Классы-модели данных
│  ├─ Task.js
│  └─ Subtask.js
├─ store/                     # Логика состояния приложения
│  └─ todoStore.js            # Инициализация хранилища, EventEmitter
├─ utils/                     # Утилиты для работы с API
│  └─ apiClient.js            # Запросы к бэкенду
└─ variables/                 # Глобальные переменные
   └─ toMain.js               # store и контейнер #todoApp
```

### 2. Back-End (`todoBackend/`)

```
todoBackend/
├─ server/                    # Код API-сервера
│  ├─ db.js                   # Настройка подключения к PostgreSQL
│  ├─ routes/
│  │  ├─ tasks.js            # CRUD для /tasks
│  │  └─ subtasks.js         # CRUD для /subtasks и /tasks/:taskId/subtasks
│  └─ server.js               # Express‑приложение (CORS, JSON)
└─ package.json               # Зависимости и скрипты
```

### 3. Database (`todoDb/`)

```
todoDb/
└─ dump.sql                   # DDL-сценарий (schema_main.tasks + subtasks)
```

---

## 🚀 Технологии

- **Front-End:**

  - Чистый JavaScript с модулями (ES6)
  - DOM‑манипуляции, подписка на события через EventEmitter

- **Back-End:**

  - Node.js + Express
  - PostgreSQL + `node-postgres (pg)`
  - REST API: JSON, CORS

- **БД:**

  - SQL‑скрипт для создания базы и таблиц (`todoDb/dump.sql`)

---

## 💾 Установка и запуск

### 1. Подготовка базы данных

```bash
# В psql или pgAdmin:
CREATE DATABASE todo_db;
\c todo_db
-- Выполнить скрипт dump.sql
\i path/to/todoDb/dump.sql
```

### 2. Запуск Back-End

```bash
cd todoBackend/server
npm install
# При необходимости отредактировать подключение в db.js
npm start
# По умолчанию слушает http://localhost:3000
```

### 3. Запуск Front-End

```bash
cd todoApp
# Если требуется установить зависимости (например, сборщик)
npm install        # или yarn install
# Запуск локального dev‑сервера (live-server, http-server и т.п.)
npm run dev        # либо просто откройте index.html в браузере
```

- Откройте в браузере `http://127.0.0.1:8080` (или путь к `index.html`).

---

## ⚙️ Конфигурация

- **API_URL:**
  Задаётся в `todoApp/utils/apiClient.js` (по умолчанию `http://localhost:3000`).
- **Параметры БД:**
  В файле `todoBackend/server/db.js` указываются пользователь, пароль, хост и порт PostgreSQL.

---

## 📋 Использование

1. **Добавление задачи:** нажать «Добавить задачу» и ввести название.
2. **Пометка выполненных:** клик по чекбоксу у задачи/подзадачи.
3. **Добавление подзадачи:** у каждой задачи кнопка «Добавить подзадачу».
4. **Удаление отмеченных:** кнопка «Удалить выбранные» (soft delete).
5. **Свернуть/развернуть список:** кнопка «Свернуть список».
6. **Уведомления:** запрашивается разрешение на Web Notifications.

---

## 📝 Лицензия

MIT © 2025 Приходько Дмитрий (dimbo1324)
