export class Task {
    task_id: number;
    task_name: string;
    task_category: string;
    task_description: string;

    constructor(task_id: number, task_name: string, task_category: string, task_description: string) {
        this.task_id = task_id;
        this.task_name = task_name;
        this.task_category = task_category;
        this.task_description = task_description;
    }
}