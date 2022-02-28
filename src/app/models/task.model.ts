import { ETask } from "./etask.enum";
import { Story } from "./story.model";
import { User } from "./user.model";

export class Task {

    public id: number;
    public name: string;
    public description: string;
    public sdate_debut: Date;
    public sdate_fin: Date;
    public estimation: number;
    public statut: ETask ;
    public story: Story;
    public developer: User;
}