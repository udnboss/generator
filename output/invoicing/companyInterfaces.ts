import { IEntity } from "./base";



export interface ICompany extends IEntity {
    name:string;
    address:string;
    crn:string;
    trn:string;
    contact:string;
    mobile:string;
    email:string;
}

export interface ICompanyCreate extends IEntity {
    name:string;
    address:string;
    crn:string;
    trn:string;
    contact:string;
    mobile:string;
    email:string;
}

export interface ICompanyUpdate extends IEntity {
    name:string;
    address:string;
    crn:string;
    trn:string;
    contact:string;
    mobile:string;
    email:string;
}

export interface ICompanyPartial extends IEntity {
    name?:string;
    address?:string;
    crn?:string;
    trn?:string;
    contact?:string;
    mobile?:string;
    email?:string;
}

export interface ICompanyView extends IEntity {
    name?:string;
    address?:string;
    crn?:string;
    trn?:string;
    contact?:string;
    mobile?:string;
    email?:string;
}
