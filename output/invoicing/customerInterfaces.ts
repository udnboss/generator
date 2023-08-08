import { IEntity } from "./base";

import { ICurrencyView } from "./currencyInterfaces";
import { ISaleView } from "./saleInterfaces";

export interface ICustomer extends IEntity {
    name:str;
    address?:str;
    contact?:str;
    currency_id?:str;
    payment_term?:int;
}

export interface ICustomerCreate extends IEntity {
    name:str;
    address?:str;
    contact?:str;
    currency_id?:str;
    payment_term?:int;
}

export interface ICustomerUpdate extends IEntity {
    name:str;
    address?:str;
    contact?:str;
    currency_id?:str;
    payment_term?:int;
}

export interface ICustomerPartial extends IEntity {
    name?:str;
    address?:str;
    contact?:str;
    currency_id?:str;
    payment_term?:int;
}

export interface ICustomerView extends IEntity {
    name?:str;
    address?:str;
    contact?:str;
    currency_id?:str;
    currency?:ICurrencyView;
    payment_term?:int;
    sales?:ISaleView[];
}
