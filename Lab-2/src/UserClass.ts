// UserClass.ts
export class UserClass {
    id: number;
    firstName: string;
    lastName: string;

    constructor(id: number, firstName: string, lastName: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

export class UserManager {
    private currentUser: UserClass | null = null;

    setCurrentUser(user: UserClass) {
        this.currentUser = user;
    }

    getCurrentUser(): UserClass | null {
        return this.currentUser;
    }

    mockLogin() {
        this.currentUser = new UserClass(1, "John", "Doe");
    }
}
