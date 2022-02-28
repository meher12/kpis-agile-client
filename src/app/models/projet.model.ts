import { Sprint } from "./sprint.model";
import { Story } from "./story.model";
import { User } from "./user.model";

export class Projet{

    public id: number;
    public titre: string;
    public description: string;
    public date_debut: Date;
    public date_fin: Date;
    public iteration_sprint: number;
    public nomPo: string;
    public team_membres: User[];
    public stories: Story[];
    public sprints: Sprint[];
}