import { Entity } from "./base";



export class Company extends Entity {
    name:string;
    address:string;
    crn:string;
    trn:string;
    contact:string;
    mobile:string;
    email:string;
}

export class CompanyCreate extends Entity {
    name:string;
    address:string;
    crn:string;
    trn:string;
    contact:string;
    mobile:string;
    email:string;
}

export class CompanyUpdate extends Entity {
    name:string;
    address:string;
    crn:string;
    trn:string;
    contact:string;
    mobile:string;
    email:string;
}

export class CompanyPartial extends Entity {
    name?:string;
    address?:string;
    crn?:string;
    trn?:string;
    contact?:string;
    mobile?:string;
    email?:string;
}

export class CompanyView extends Entity {
    name?:string;
    address?:string;
    crn?:string;
    trn?:string;
    contact?:string;
    mobile?:string;
    email?:string;
}