import { IEntity } from "./base";



export interface IAccount extends IEntity {
    label:string;
    bank_name:string;
    bank_address:string;
    bank_swift:string;
    account_name:string;
    account_iban:string;
    account_address:string;
}

export interface IAccountCreate extends IEntity {
    label:string;
    bank_name:string;
    bank_address:string;
    bank_swift:string;
    account_name:string;
    account_iban:string;
    account_address:string;
}

export interface IAccountUpdate extends IEntity {
    label:string;
    bank_name:string;
    bank_address:string;
    bank_swift:string;
    account_name:string;
    account_iban:string;
    account_address:string;
}

export interface IAccountPartial extends IEntity {
    label?:string;
    bank_name?:string;
    bank_address?:string;
    bank_swift?:string;
    account_name?:string;
    account_iban?:string;
    account_address?:string;
}

export interface IAccountView extends IEntity {
    label?:string;
    bank_name?:string;
    bank_address?:string;
    bank_swift?:string;
    account_name?:string;
    account_iban?:string;
    account_address?:string;
}
