export class Task {
    task_id: number;
    task_name: string;
    category: string;
    description: string;

    constructor(task_id: number, task_name: string, task_category: string, task_description: string) {
        this.task_id = task_id;
        this.task_name = task_name;
        this.category = task_category;
        this.description = task_description;
    }
}