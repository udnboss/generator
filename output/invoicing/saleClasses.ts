import { Entity } from "./base";

import { ICurrencyView } from "./currencyInterfaces";
import { ICustomerView } from "./customerInterfaces";
import { IAccountView } from "./accountInterfaces";
import { ICompanyView } from "./companyInterfaces";
import { ISaleitemView } from "./saleItemInterfaces";

export class Sale extends Entity {
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

export class SaleCreate extends Entity {
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

export class SaleUpdate extends Entity {
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

export class SalePartial extends Entity {
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

export class SaleView extends Entity {
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