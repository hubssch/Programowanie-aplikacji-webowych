// StoryView.ts
import { StoryManager } from './StoryManager';
import { Story, StoryStatus } from "./Story"
import { UserManager } from "./UserClass"
import { ProjectManager } from './ProjectManager';

class StoryView {
    private storyManager: StoryManager;

    constructor(storyManager: StoryManager) {
        this.storyManager = storyManager;
    }

    renderStories(projectId: number, filterStatus?: StoryStatus) {
        const stories = this.storyManager.getStories(projectId).filter(story => {
            if (filterStatus) {
                return story.status === filterStatus;
            }
            return true;
        });

        // Renderowanie listy historyjek (w rzeczywistej aplikacji możesz użyć frameworku takiego jak React)
        stories.forEach(story => {
            console.log(`${story.id}: ${story.name} [${story.status}]`);
        });
    }
}

// Przykład użycia
const userManager = new UserManager();
userManager.mockLogin();
const projectManager = new ProjectManager();
projectManager.setCurrentProject(1);

const storyManager = new StoryManager();
const storyView = new StoryView(storyManager);

storyManager.createStory('Implement login', 'Create login functionality', 'high', 1, 1);
storyManager.createStory('Setup project', 'Initial project setup', 'medium', 1, 1);

storyView.renderStories(1); // Renderowanie wszystkich historyjek w projekcie 1
storyView.renderStories(1, StoryStatus.TODO); // Renderowanie tylko historyjek z status TODO w projekcie 1
