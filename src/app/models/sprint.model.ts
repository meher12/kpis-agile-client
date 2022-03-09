import { Projet } from "./projet.model";


export class Sprint {

    public id: number;
    public stitre: String;
    public sReference: String;
    public sdescription: String;
    public sdate_debut: Date;
    public sdate_fin: Date;
    public projets: Projet;
}