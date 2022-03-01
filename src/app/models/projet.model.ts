import { Sprint } from "./sprint.model";

export class Projet {

    public id: number;
    public titre: string;
    public description: string;
    public date_debut: Date;
    public date_fin: Date;
    public sprints: Sprint[];
}