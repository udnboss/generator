import { IEntity } from "./base";

import { ICurrencyView } from "./currencyInterfaces";
import { ICustomerView } from "./customerInterfaces";
import { IAccountView } from "./accountInterfaces";
import { ICompanyView } from "./companyInterfaces";
import { ISaleitemView } from "./saleItemInterfaces";

export interface ISale extends IEntity {
    company_id:str;
    account_id:str;
    customer_id:str;
    place?:str;
    number:int;
    date:date;
    currency_id:str;
    total:float;
    reference?:str;
    confirmed:bool;
    reference_date?:date;
    due_date?:date;
}

export interface ISaleCreate extends IEntity {
    company_id:str;
    account_id:str;
    customer_id:str;
    place?:str;
    number:int;
    date:date;
    currency_id:str;
    reference?:str;
    confirmed:bool;
    reference_date?:date;
    due_date?:date;
}

export interface ISaleUpdate extends IEntity {
    company_id:str;
    account_id:str;
    customer_id:str;
    place?:str;
    number:int;
    currency_id:str;
    reference?:str;
    confirmed:bool;
    reference_date?:date;
    due_date?:date;
}

export interface ISalePartial extends IEntity {
    company_id?:str;
    account_id?:str;
    customer_id?:str;
    place?:str;
    number?:int;
    currency_id?:str;
    reference?:str;
    confirmed?:bool;
    reference_date?:date;
    due_date?:date;
}

export interface ISaleView extends IEntity {
    company_id?:str;
    account_id?:str;
    customer_id?:str;
    place?:str;
    number?:int;
    date?:date;
    currency_id?:str;
    total?:float;
    reference?:str;
    confirmed?:bool;
    reference_date?:date;
    due_date?:date;
    currency?:ICurrencyView;
    customer?:ICustomerView;
    account?:IAccountView;
    company?:ICompanyView;
    items?:ISaleitemView[];
}
