import { Sprint } from "./sprint.model";
import { Task } from "./task.model";

export class Story{

    public id: number;
    public stReference: string;
    public stname: string;
    public storyPoint: number;
    public priority: number;
    public stdescription: string;
    public sprint: Sprint;
    public tasks: Task[];


}