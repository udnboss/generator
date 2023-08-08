import { IEntity } from "./base";



export interface IAccount extends IEntity {
    label:str;
    bank_name:str;
    bank_address:str;
    bank_swift:str;
    account_name:str;
    account_iban:str;
    account_address:str;
}

export interface IAccountCreate extends IEntity {
    label:str;
    bank_name:str;
    bank_address:str;
    bank_swift:str;
    account_name:str;
    account_iban:str;
    account_address:str;
}

export interface IAccountUpdate extends IEntity {
    label:str;
    bank_name:str;
    bank_address:str;
    bank_swift:str;
    account_name:str;
    account_iban:str;
    account_address:str;
}

export interface IAccountPartial extends IEntity {
    label?:str;
    bank_name?:str;
    bank_address?:str;
    bank_swift?:str;
    account_name?:str;
    account_iban?:str;
    account_address?:str;
}

export interface IAccountView extends IEntity {
    label?:str;
    bank_name?:str;
    bank_address?:str;
    bank_swift?:str;
    account_name?:str;
    account_iban?:str;
    account_address?:str;
}
