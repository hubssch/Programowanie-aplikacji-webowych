import './style.css';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, onValue, remove, update } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

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
const InputName = document.querySelector("#input-name") as HTMLInputElement;
const InputDescription = document.querySelector("#input-description") as HTMLInputElement;

const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")

const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn")

const emailInputEl = document.getElementById("email-input") as HTMLInputElement
const passwordInputEl = document.getElementById("password-input") as HTMLInputElement

const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("create-account-btn")

const signOutButtonEl = document.getElementById("sign-out-btn")

interface Project {
  id: string;
  name: string;
  description: string;
}

// Event listeners
Add?.addEventListener('click', addInputValueToProjects);

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

signOutButtonEl.addEventListener("click", authSignOut)

// Functions

showLoggedInView()

function authSignInWithGoogle() {
  console.log("Sign in with Google")
}

function authSignInWithEmail() {
  const auth = getAuth();
  const email = emailInputEl.value
  const password = passwordInputEl.value
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showLoggedInView();
      clearAuthFields()
    })
    .catch((error) => {
      console.error(error.message)
    });
}

function authCreateAccountWithEmail() {
  const auth = getAuth();
  const email = emailInputEl.value
  const password = passwordInputEl.value
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showLoggedInView();
      clearAuthFields()
    })
    .catch((error) => {
      console.error(error.message)
      // ..
    });
}

function authSignOut() {
  const auth = getAuth();
  signOut(auth).then(() => {
    showLoggedOutView();
  }).catch((error) => {
    console.error(error.message);
  });
}

function addInputValueToProjects(): void {
  const nameValue = InputName.value.trim();
  const descriptionValue = InputDescription.value.trim();
  if (!nameValue || !descriptionValue) {
    alert("Error: Name and description cannot be empty!");
    return;
  }
  saveProjectToDatabase(nameValue, descriptionValue);
  InputName.value = "";
  InputDescription.value = "";
}

async function saveProjectToDatabase(name: string, description: string): Promise<void> {
  try {
    const newProjectRef = push(ref(db, 'projects'));
    await set(newProjectRef, { name, description });
    console.log("Project added!");
    getProjectsFromDatabase(); // Refresh the list
  } catch (error) {
    console.error("Error adding project: ", error);
    alert("Error adding project: " + (error as Error).message);
  }
}

function getProjectsFromDatabase(): void {
  const projectsRef = ref(db, 'projects');
  onValue(projectsRef, (snapshot) => {
    const projects = [];
    snapshot.forEach((childSnapshot) => {
      projects.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });
    renderProjects(projects);
  });
}

async function deleteProjectFromDatabase(id: string): Promise<void> {
  const confirmDeletion = confirm("Are you sure you want to delete this project?");
  if (confirmDeletion) {
    try {
      await remove(ref(db, `projects/${id}`));
      console.log("Project deleted!");
      getProjectsFromDatabase(); // Refresh the list
    } catch (error) {
      console.error("Error deleting project: ", error);
      alert("Error deleting project: " + (error as Error).message);
    }
  }
}

async function editProject(id: string, name: string, description: string): Promise<void> {
  const newNameValue = prompt("Enter new project name:", name);
  const newDescriptionValue = prompt("Enter new project description:", description);
  if (newNameValue !== null && newNameValue.trim() !== '' && newDescriptionValue !== null && newDescriptionValue.trim() !== '') {
    try {
      await update(ref(db, `projects/${id}`), { name: newNameValue.trim(), description: newDescriptionValue.trim() });
      console.log("Project updated!");
      getProjectsFromDatabase();
    } catch (error) {
      console.error("Error updating project: ", error);
      alert("Error updating project: " + (error as Error).message);
    }
  }
}

function renderProjects(projects: Project[]): void {
  const olElement = document.querySelector("#project-list");
  if (olElement) {
    while (olElement.firstChild) {
      olElement.removeChild(olElement.firstChild);
    }
    projects.forEach((projectObj) => {
      const projectListItem = document.createElement("li");
      const projectInfo = document.createElement("div");
      const buttonsDiv = document.createElement("div");

      projectInfo.classList.add("project-info");
      buttonsDiv.classList.add("buttons");

      const projectEditButton = document.createElement("button");
      const projectDeleteButton = document.createElement("button");

      projectInfo.innerText = `${projectObj.name}: ${projectObj.description}`;
      projectEditButton.innerText = "Edit";
      projectDeleteButton.innerText = "Delete";

      projectEditButton.addEventListener('click', () => editProject(projectObj.id, projectObj.name, projectObj.description));
      projectDeleteButton.addEventListener('click', () => deleteProjectFromDatabase(projectObj.id));

      buttonsDiv.appendChild(projectEditButton);
      buttonsDiv.appendChild(projectDeleteButton);

      projectListItem.appendChild(projectInfo);
      projectListItem.appendChild(buttonsDiv);
      olElement.appendChild(projectListItem);
    });
  }
}


function showLoggedOutView() {
  hideView(viewLoggedIn)
  showView(viewLoggedOut)
}

function showLoggedInView() {
  hideView(viewLoggedOut)
  showView(viewLoggedIn)
}

function showView(view) {
  view.style.display = "flex"
}

function hideView(view) {
  view.style.display = "none"
}

function clearInputField(field) {
  field.value = ""
}

function clearAuthFields() {
  clearInputField(emailInputEl)
  clearInputField(passwordInputEl)
}

// Początkowe ładowanie projektów
getProjectsFromDatabase();
