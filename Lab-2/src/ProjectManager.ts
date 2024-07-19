import { db } from './firebaseConfig';
import { ref, set, push, onValue, remove, update } from 'firebase/database';
import StoryManager from './StoryManager';

interface Project {
    id: string;
    name: string;
    description: string;
}

class ProjectManager {
    private projectListElement: HTMLElement | null;
    private storyManager: StoryManager;

    constructor() {
        this.projectListElement = document.querySelector("#project-list");
        this.storyManager = new StoryManager();
    }

    public async addProject(name: string, description: string): Promise<void> {
        try {
            const newProjectRef = push(ref(db, 'projects'));
            await set(newProjectRef, { name, description });
            console.log("Project added!");
            this.getProjects();
        } catch (error) {
            console.error("Error adding project: ", error);
            alert("Error adding project: " + (error as Error).message);
        }
    }

    public getProjects(): void {
        const projectsRef = ref(db, 'projects');
        onValue(projectsRef, (snapshot) => {
            const projects: Project[] = [];
            snapshot.forEach((childSnapshot) => {
                projects.push({ id: childSnapshot.key!, ...childSnapshot.val() });
            });
            this.renderProjects(projects);
        });
    }

    public async deleteProject(id: string): Promise<void> {
        const confirmDeletion = confirm("Are you sure you want to delete this project?");
        if (confirmDeletion) {
            try {
                await remove(ref(db, `projects/${id}`));
                console.log("Project deleted!");
                this.getProjects();
            } catch (error) {
                console.error("Error deleting project: ", error);
                alert("Error deleting project: " + (error as Error).message);
            }
        }
    }

    public async editProject(id: string, name: string, description: string): Promise<void> {
        const newName = prompt("Enter new project name:", name);
        const newDescription = prompt("Enter new project description:", description);
        if (newName !== null && newDescription !== null && newName.trim() !== '' && newDescription.trim() !== '') {
            try {
                await update(ref(db, `projects/${id}`), { name: newName.trim(), description: newDescription.trim() });
                console.log("Project updated!");
                this.getProjects();
            } catch (error) {
                console.error("Error updating project: ", error);
                alert("Error updating project: " + (error as Error).message);
            }
        }
    }

    private renderProjects(projects: Project[]): void {
        if (this.projectListElement) {
            this.projectListElement.innerHTML = '';
            projects.forEach((project) => {
                const projectListItem = document.createElement("li");
                const projectInfo = document.createElement("div");
                const buttonsDiv = document.createElement("div");

                projectInfo.classList.add("project-info");
                buttonsDiv.classList.add("buttons");

                const projectName = document.createElement("div");
                const projectDescription = document.createElement("div");
                const projectEditButton = document.createElement("button");
                const projectDeleteButton = document.createElement("button");

                projectName.classList.add("project-name");
                projectDescription.classList.add("project-description");

                projectName.innerText = project.name;
                projectDescription.innerText = project.description;
                projectEditButton.innerText = "Edit";
                projectDeleteButton.innerText = "Delete";

                projectInfo.addEventListener('click', () => {
                    this.showProjectView(project.id, project.name);
                });
                projectEditButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.editProject(project.id, project.name, project.description);
                });
                projectDeleteButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.deleteProject(project.id);
                });

                projectInfo.appendChild(projectName);
                projectInfo.appendChild(projectDescription);
                buttonsDiv.appendChild(projectEditButton);
                buttonsDiv.appendChild(projectDeleteButton);

                projectListItem.appendChild(projectInfo);
                projectListItem.appendChild(buttonsDiv);
                this.projectListElement?.appendChild(projectListItem);
            });
        }
    }

    private showProjectView(projectId: string, projectName: string): void {
        const projectView = document.getElementById("project-view");
        const loggedInView = document.getElementById("logged-in-view");
        const projectTitle = document.getElementById("project-title");

        if (projectView && loggedInView && projectTitle) {
            loggedInView.style.display = "none";
            projectView.style.display = "block";
            projectTitle.innerText = `Project: ${projectName}`;
            this.storyManager.setProjectId(projectId);
            this.storyManager.getStories();
        }
    }
}

export default ProjectManager;
