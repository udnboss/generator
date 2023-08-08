import { IEntity } from "./base";



export interface ICompany extends IEntity {
    name:str;
    address:str;
    crn:str;
    trn:str;
    contact:str;
    mobile:str;
    email:str;
}

export interface ICompanyCreate extends IEntity {
    name:str;
    address:str;
    crn:str;
    trn:str;
    contact:str;
    mobile:str;
    email:str;
}

export interface ICompanyUpdate extends IEntity {
    name:str;
    address:str;
    crn:str;
    trn:str;
    contact:str;
    mobile:str;
    email:str;
}

export interface ICompanyPartial extends IEntity {
    name?:str;
    address?:str;
    crn?:str;
    trn?:str;
    contact?:str;
    mobile?:str;
    email?:str;
}

export interface ICompanyView extends IEntity {
    name?:str;
    address?:str;
    crn?:str;
    trn?:str;
    contact?:str;
    mobile?:str;
    email?:str;
}
