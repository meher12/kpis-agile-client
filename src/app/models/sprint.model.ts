import { Projet } from "./projet.model";
import { Story } from "./story.model";

export class Sprint {

    public id: number;
    public stitre: String;
    public sdescription: String;
    public sdate_debut: Date;
    public sdate_fin: Date;
    public story_of_sprint: Story[];
    public sprint_of_project: Projet;

}