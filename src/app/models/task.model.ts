import { ETask } from "./etask.enum";
import { Story } from "./story.model";


export class Task {

    public id: number;
    public tReference: string;
    public tname: string;
    public tdescription: string;
    public testimation: number;
    public tdateDebut: Date;
    public tdateFin: Date;
    public statut: ETask ;
    public story: Story;
}