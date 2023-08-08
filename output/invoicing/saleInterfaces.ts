import { IEntity } from "./base";

import { ICurrencyView } from "./currencyInterfaces";
import { ICustomerView } from "./customerInterfaces";
import { IAccountView } from "./accountInterfaces";
import { ICompanyView } from "./companyInterfaces";
import { ISaleitemView } from "./saleItemInterfaces";

export interface ISale extends IEntity {
    company_id:string;
    account_id:string;
    customer_id:string;
    place?:string;
    number?:number;
    date:string;
    currency_id:string;
    total:number;
    reference?:string;
    confirmed:boolean;
    reference_date?:string;
    due_date?:string;
}

export interface ISaleCreate extends IEntity {
    company_id:string;
    account_id:string;
    customer_id:string;
    place?:string;
    date:string;
    currency_id:string;
    reference?:string;
    confirmed:boolean;
    reference_date?:string;
    due_date?:string;
}

export interface ISaleUpdate extends IEntity {
    company_id:string;
    account_id:string;
    customer_id:string;
    place?:string;
    currency_id:string;
    reference?:string;
    confirmed:boolean;
    reference_date?:string;
    due_date?:string;
}

export interface ISalePartial extends IEntity {
    company_id?:string;
    account_id?:string;
    customer_id?:string;
    place?:string;
    currency_id?:string;
    reference?:string;
    confirmed?:boolean;
    reference_date?:string;
    due_date?:string;
}

export interface ISaleView extends IEntity {
    company_id?:string;
    account_id?:string;
    customer_id?:string;
    place?:string;
    number?:number;
    date?:string;
    currency_id?:string;
    total?:number;
    reference?:string;
    confirmed?:boolean;
    reference_date?:string;
    due_date?:string;
    currency?:ICurrencyView;
    customer?:ICustomerView;
    account?:IAccountView;
    company?:ICompanyView;
    items?:ISaleitemView[];
}
