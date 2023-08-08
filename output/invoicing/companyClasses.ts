import { Entity } from "./base";



export class Company extends Entity {
    name:str;
    address:str;
    crn:str;
    trn:str;
    contact:str;
    mobile:str;
    email:str;
}

export class CompanyCreate extends Entity {
    name:str;
    address:str;
    crn:str;
    trn:str;
    contact:str;
    mobile:str;
    email:str;
}

export class CompanyUpdate extends Entity {
    name:str;
    address:str;
    crn:str;
    trn:str;
    contact:str;
    mobile:str;
    email:str;
}

export class CompanyPartial extends Entity {
    name?:str;
    address?:str;
    crn?:str;
    trn?:str;
    contact?:str;
    mobile?:str;
    email?:str;
}

export class CompanyView extends Entity {
    name?:str;
    address?:str;
    crn?:str;
    trn?:str;
    contact?:str;
    mobile?:str;
    email?:str;
}