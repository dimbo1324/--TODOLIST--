CREATE DATABASE todo_db;
CREATE SCHEMA schema_main;
CREATE TABLE schema_main.tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  deleted BOOLEAN DEFAULT FALSE
);
CREATE TABLE schema_main.subtasks (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES schema_main.tasks(id),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  deleted BOOLEAN DEFAULT FALSE
);