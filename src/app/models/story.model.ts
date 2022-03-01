import { Projet } from "./projet.model";
import { Sprint } from "./sprint.model";

export class Story{

    public id: number;
    public name: string;
    public description: string;
    public story_point: number;
    public priorite: number;
    public  story_of_sprint: Sprint;
    public  story_of_projet: Projet;


}