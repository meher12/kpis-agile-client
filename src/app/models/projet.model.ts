import { Sprint } from "./sprint.model";


export class Projet {

    public id: number;
    public pReference: string
    public titre: string;
    public descriptionProject: string;
    public dateDebut: Date;
    public dateFin: Date;
    public pupdatedDate: Date;
    public sprints: Sprint[]

    public pSpCommitment: string[];
    public pSpwrked: string[];
    public pMoresp: string[];
   
}