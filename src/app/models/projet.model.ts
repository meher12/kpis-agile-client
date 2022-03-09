import { Sprint } from "./sprint.model";


export class Projet {

    public id: number;
    public pReference: string
    public titre: string;
    public descriptionProject: string;
    public dateDebut: Date;
    public dateFin: Date;
    public sprints: Sprint[]
   
}