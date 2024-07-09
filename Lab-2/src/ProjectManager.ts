export class ProjectManager {
    private currentProjectId: number | null = null;

    setCurrentProject(projectId: number) {
        this.currentProjectId = projectId;
    }

    getCurrentProject(): number | null {
        return this.currentProjectId;
    }
}