import { IEntity } from "./base";

import { ICurrencyView } from "./currencyInterfaces";
import { ISaleView } from "./saleInterfaces";

export interface ICustomer extends IEntity {
    name:string;
    address?:string;
    contact?:string;
    currency_id?:string;
    payment_term?:number;
}

export interface ICustomerCreate extends IEntity {
    name:string;
    address?:string;
    contact?:string;
    currency_id?:string;
    payment_term?:number;
}

export interface ICustomerUpdate extends IEntity {
    name:string;
    address?:string;
    contact?:string;
    currency_id?:string;
    payment_term?:number;
}

export interface ICustomerPartial extends IEntity {
    name?:string;
    address?:string;
    contact?:string;
    currency_id?:string;
    payment_term?:number;
}

export interface ICustomerView extends IEntity {
    name?:string;
    address?:string;
    contact?:string;
    currency_id?:string;
    currency?:ICurrencyView;
    payment_term?:number;
    sales?:ISaleView[];
}
