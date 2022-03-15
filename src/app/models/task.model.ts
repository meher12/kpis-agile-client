import { ETask, ETypeTask } from "./etask.enum";
import { Story } from "./story.model";


export class Task {

    public id: number;
    public tReference: string;
    public tname: string;
    public tdescription: string;
    public tdateDebut: Date;
    public tdateFin: Date;
    public status: ETask ;
    public typeTask: ETypeTask;
    public story: Story;
}