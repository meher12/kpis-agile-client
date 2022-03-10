import { Projet } from "./projet.model";


export class Sprint {

    public id: number;
    public stitre: String;
    public sReference: String;
    public sdescription: String;
    public sdateDebut: Date;
    public sdateFin: Date;
    public projet: Projet;
}