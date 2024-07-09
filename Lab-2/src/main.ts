import './style.css';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, onValue, remove, update } from 'firebase/database';

// Konfiguracja Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCCdkwkvXZ3Asf2Rp5OivDqYOR-VRPDszk",
  authDomain: "playground-4863b.firebaseapp.com",
  databaseURL: "https://playground-4863b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "playground-4863b",
  storageBucket: "playground-4863b.appspot.com",
  messagingSenderId: "764285963865",
  appId: "1:764285963865:web:57d1998230a9dbda0dab48"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Selektory
const Add = document.querySelector("#add");
const Input = document.querySelector("#input") as HTMLInputElement;

interface Task {
  id: string;
  task: string;
}

// Event listeners
Add?.addEventListener('click', addInputValueToTasks);

function addInputValueToTasks(): void {
  const inputValue = Input.value.trim();
  if (!inputValue) {
    alert("Error: Task cannot be empty!");
    return;
  }
  saveTaskToDatabase(inputValue);
  Input.value = "";
}

async function saveTaskToDatabase(task: string): Promise<void> {
  try {
    const newTaskRef = push(ref(db, 'tasks'));
    await set(newTaskRef, { task });
    console.log("Task added!");
    getTasksFromDatabase(); // Refresh the list
  } catch (error) {
    console.error("Error adding task: ", error);
    alert("Error adding task: " + (error as Error).message);
  }
}

function getTasksFromDatabase(): void {
  const tasksRef = ref(db, 'tasks');
  onValue(tasksRef, (snapshot) => {
    const tasks = [];
    snapshot.forEach((childSnapshot) => {
      tasks.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });
    renderTasks(tasks);
  });
}

async function deleteTaskFromDatabase(id: string): Promise<void> {
  const confirmDeletion = confirm("Are you sure you want to delete this task?");
  if (confirmDeletion) {
    try {
      await remove(ref(db, `tasks/${id}`));
      console.log("Task deleted!");
      getTasksFromDatabase(); // Refresh the list
    } catch (error) {
      console.error("Error deleting task: ", error);
      alert("Error deleting task: " + (error as Error).message);
    }
  }
}

async function editTask(id: string, task: string): Promise<void> {
  const newTaskValue = prompt("Enter new task value:", task);
  if (newTaskValue !== null && newTaskValue.trim() !== '') {
    try {
      await update(ref(db, `tasks/${id}`), { task: newTaskValue.trim() });
      console.log("Task updated!");
      getTasksFromDatabase();
    } catch (error) {
      console.error("Error updating task: ", error);
      alert("Error updating task: " + (error as Error).message);
    }
  }
}

function renderTasks(tasks: Task[]): void {
  const olElement = document.querySelector("#task-list");
  if (olElement) {
    while (olElement.firstChild) {
      olElement.removeChild(olElement.firstChild);
    }
    tasks.forEach((taskObj) => {
      const taskList = document.createElement("li");
      const taskEditButton = document.createElement("button");
      const taskDeleteButton = document.createElement("button");

      taskList.innerText = taskObj.task;
      taskEditButton.innerText = "Edit";
      taskDeleteButton.innerText = "Delete";

      taskEditButton.addEventListener('click', () => editTask(taskObj.id, taskObj.task));
      taskDeleteButton.addEventListener('click', () => deleteTaskFromDatabase(taskObj.id));

      taskList.appendChild(taskEditButton);
      taskList.appendChild(taskDeleteButton);
      olElement.appendChild(taskList);
    });
  }
}

// Początkowe ładowanie zadań
getTasksFromDatabase();
