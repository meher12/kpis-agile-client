import { Projet } from "./projet.model";
import { Task } from "./task.model";

export class User {

    public id: number;
    public username: String;
    public  email: String;
    public projet: Projet;
    public tasks: Task[];
}