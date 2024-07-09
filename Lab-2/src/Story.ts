export enum StoryStatus {
    TODO = "todo",
    DOING = "doing",
    DONE = "done"
}

export class Story {
    id: number;
    name: string;
    description: string;
    priority: "low" | "medium" | "high";
    projectId: number;
    creationDate: Date;
    status: StoryStatus;
    ownerId: number;

    constructor(id: number, name: string, description: string, priority: 'low' | 'medium' | 'high', projectId: number, creationDate: Date, status: StoryStatus, ownerId: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.projectId = projectId;
        this.creationDate = creationDate;
        this.status = status;
        this.ownerId = ownerId;
    }
}