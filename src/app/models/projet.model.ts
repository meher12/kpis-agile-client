import { Sprint } from "./sprint.model";
import { Team } from "./team.model";
import { User } from "./user.model";


export class Projet {

    public id: number;
    public pReference: string
    public titre: string;
    public totalspCommitment: number;
    public totalstorypointsinitiallycounts: number;
    public descriptionProject: string;
    public dateDebut: Date;
    public dateFin: Date;
    public pupdatedDate: Date;
    public sprints: Sprint[];
    public users: Team[];

    public pSpCommitment: string[];
    public pSpwrked: string[];
    public pMoresp: string[];
    public percentage_spc: string[];
   
}

export interface Efficacity {
    KeyArr: any[],
    FloatArr: any[],
    
  }

  export interface TaskBugs {
    endDateArray: any[],
    taskBugsArray: any[],
    taskSafe: any[],
    
  }