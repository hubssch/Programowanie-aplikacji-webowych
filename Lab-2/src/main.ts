import './style.css';
import ProjectManager from './ProjectManager';
import StoryManager from './StoryManager';
import TaskManager from './TaskManager';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// Inicjalizacja managerów
const projectManager = new ProjectManager();
const storyManager = new StoryManager();
const taskManager = new TaskManager();

// Selektory
const addProjectButton = document.querySelector("#add");
const inputProjectName = document.querySelector("#input-name") as HTMLInputElement;
const inputProjectDescription = document.querySelector("#input-description") as HTMLInputElement;
const addStoryButton = document.querySelector("#add-story");
const inputStoryName = document.querySelector("#input-story-name") as HTMLInputElement;
const inputStoryDescription = document.querySelector("#input-story-description") as HTMLInputElement;
const inputStoryPriority = document.querySelector("#input-story-priority") as HTMLSelectElement;
const addTaskButton = document.querySelector("#add-task");
const inputTaskName = document.querySelector("#input-task-name") as HTMLInputElement;
const inputTaskDescription = document.querySelector("#input-task-description") as HTMLInputElement;
const inputTaskPriority = document.querySelector("#input-task-priority") as HTMLSelectElement;
const inputTaskTime = document.querySelector("#input-task-time") as HTMLInputElement;
const loggedInView = document.getElementById("logged-in-view");
const loggedOutView = document.getElementById("logged-out-view");
const signInButton = document.querySelector("#sign-in-btn");
const createAccountButton = document.querySelector("#create-account-btn");
const emailInput = document.querySelector("#email-input") as HTMLInputElement;
const passwordInput = document.querySelector("#password-input") as HTMLInputElement;
const signOutButton = document.querySelector("#sign-out-btn");
const backToProjectsButton = document.querySelector("#back-to-projects-btn");
const backToStoriesButton = document.querySelector("#back-to-stories-btn");

// Event listeners
addProjectButton?.addEventListener('click', () => {
  const name = inputProjectName.value.trim();
  const description = inputProjectDescription.value.trim();
  if (!name || !description) {
    alert("Error: Name and description cannot be empty!");
    return;
  }
  projectManager.addProject(name, description);
  inputProjectName.value = '';
  inputProjectDescription.value = '';
});

addStoryButton?.addEventListener('click', () => {
  const name = inputStoryName.value.trim();
  const description = inputStoryDescription.value.trim();
  const priority = inputStoryPriority.value as 'low' | 'medium' | 'high';
  if (!name || !description) {
    alert("Error: Name and description cannot be empty!");
    return;
  }
  console.log("Dodawanie historii: ", { name, description, priority });
  projectManager.storyManager.addStory(name, description, priority);
  inputStoryName.value = '';
  inputStoryDescription.value = '';
});

addTaskButton?.addEventListener('click', () => {
  const name = inputTaskName.value.trim();
  const description = inputTaskDescription.value.trim();
  const priority = inputTaskPriority.value as 'low' | 'medium' | 'high';
  const estimatedTime = parseInt(inputTaskTime.value.trim());
  if (!name || !description || isNaN(estimatedTime)) {
    alert("Error: Name, description, and estimated time cannot be empty!");
    return;
  }
  console.log("Dodawanie zadania: ", { name, description, priority, estimatedTime });
  projectManager.storyManager.taskManager.addTask(name, description, priority, estimatedTime);
  inputTaskName.value = '';
  inputTaskDescription.value = '';
  inputTaskTime.value = '';
});

// Logowanie
signInButton?.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showLoggedInView();
      clearAuthFields();
    })
    .catch((error) => {
      console.error("Error logging in: ", error);
      alert("Error logging in: " + error.message);
    });
});

// Tworzenie konta
createAccountButton?.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showLoggedInView();
      clearAuthFields();
    })
    .catch((error) => {
      console.error("Error creating account: ", error);
      alert("Error creating account: " + error.message);
    });
});

// Wylogowanie
signOutButton?.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      showLoggedOutView();
    })
    .catch((error) => {
      console.error("Error signing out: ", error);
      alert("Error signing out: " + error.message);
    });
});

backToProjectsButton?.addEventListener('click', () => {
  const projectView = document.getElementById("project-view");
  if (projectView && loggedInView) {
    projectView.style.display = "none";
    loggedInView.style.display = "block";
  }
});

backToStoriesButton?.addEventListener('click', () => {
  const taskView = document.getElementById("task-view");
  const projectView = document.getElementById("project-view");
  if (taskView && projectView) {
    taskView.style.display = "none";
    projectView.style.display = "block";
  }
});

// Funkcja do wyczyszczenia pól logowania
function clearAuthFields() {
  emailInput.value = '';
  passwordInput.value = '';
}

// Funkcje do zarządzania widokami
function showLoggedInView() {
  if (loggedInView) loggedInView.style.display = "block";
  if (loggedOutView) loggedOutView.style.display = "none";
}

function showLoggedOutView() {
  if (loggedInView) loggedInView.style.display = "none";
  if (loggedOutView) loggedOutView.style.display = "block";
}

// Sprawdzanie stanu uwierzytelnienia użytkownika
onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoggedInView();
    projectManager.getProjects();
  } else {
    showLoggedOutView();
  }
});
