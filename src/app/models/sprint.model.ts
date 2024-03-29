import { Projet } from "./projet.model";
import { Story } from "./story.model";


export class Sprint {

    public id: number;
    public stitre: string;
    public sReference: string;
    public sdescription: String;
    public workCommitment: number;
    public workCompleted: number;
    public sdateDebut: Date;
    public sdateFin: Date;
    public supdatedDate: Date;

    public daysarray: string[];
    public idealLinearray: string[];
    public workedlarray: string[];
    public projet: Projet;
    public stories: Story[];
}

export interface Velocity {
    numberSprint: number,
    averageVelocity: number,
    capacityStoryPointsInNextSprint: number,
  }